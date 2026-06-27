import csv
from datetime import date, datetime
import io

from flask import Blueprint, jsonify, make_response, request

from auth import admin_required, login_required
from database import db
from models import (
    ActivityLog, Customer, CustomerAllergy, DietPreference, Ingredient,
    Notification, Order, OrderItem, Product, ProductIngredient, User
)

api_bp = Blueprint('api', __name__)

# Utility helper to log activity
def log_activity(user_id, action, details):
    log = ActivityLog(user_id=user_id, action=action, details=details)
    db.session.add(log)
    db.session.commit()

# Utility helper to add notification
def add_notification(message, n_type='info'):
    notif = Notification(message=message, type=n_type)
    db.session.add(notif)
    db.session.commit()

# -------------------------------------------------------------------
# ALLERGY SAFETY CHECK UTILITY
# -------------------------------------------------------------------
def check_allergies_for_items(customer_id, items):
    customer = Customer.query.get(customer_id)
    if not customer:
        return []
    
    customer_allergies = CustomerAllergy.query.filter_by(customer_id=customer_id).all()
    if not customer_allergies:
        return []
        
    warnings = []
    allergy_map = {a.allergy_name.lower().strip(): a for a in customer_allergies}
    
    for item in items:
        product_id = item.get('product_id')
        product = Product.query.get(product_id)
        if not product:
            continue
            
        # Get product ingredients
        product_ingredients = ProductIngredient.query.filter_by(product_id=product_id).all()
        for pi in product_ingredients:
            ingredient = pi.ingredient
            if not ingredient:
                continue
                
            # Check contains_allergens list on ingredient
            contains_allergens_list = []
            if ingredient.contains_allergens:
                contains_allergens_list = [x.strip().lower() for x in ingredient.contains_allergens.split(',') if x.strip()]
                
            ing_name_lower = ingredient.name.lower()
            
            for allergy_name, allergy_obj in allergy_map.items():
                match_found = False
                match_reason = ""
                
                # Check 1: Direct match in allergen tags
                if allergy_name in contains_allergens_list:
                    match_found = True
                    match_reason = f"ingredient '{ingredient.name}' contains allergen '{allergy_obj.allergy_name}'"
                    
                # Check 2: Ingredient name contains the allergy name (e.g. "peanut" in "peanut butter")
                elif allergy_name in ing_name_lower:
                    match_found = True
                    match_reason = f"ingredient '{ingredient.name}' matches allergy '{allergy_obj.allergy_name}'"
                    
                # Check 3: Allergy name contains the ingredient name (e.g. "milk" in "whole milk")
                elif ing_name_lower in allergy_name and len(ing_name_lower) > 3:
                    match_found = True
                    match_reason = f"ingredient '{ingredient.name}' matches allergy '{allergy_obj.allergy_name}'"
                    
                if match_found:
                    warnings.append({
                        'product_name': product.name,
                        'product_id': product.id,
                        'ingredient_name': ingredient.name,
                        'allergen': allergy_obj.allergy_name,
                        'severity': allergy_obj.severity,
                        'allergy_notes': allergy_obj.notes or '',
                        'reason': match_reason
                    })
                    
    return warnings

# -------------------------------------------------------------------
# ALLERGY CHECK ENDPOINT
# -------------------------------------------------------------------
@api_bp.route('/orders/check', methods=['POST'])
@login_required
def order_allergy_check(current_user):
    data = request.json or {}
    customer_id = data.get('customer_id')
    items = data.get('items', [])
    
    if not customer_id or not items:
        return jsonify({'has_warnings': False, 'warnings': []})
        
    warnings = check_allergies_for_items(customer_id, items)
    return jsonify({
        'has_warnings': len(warnings) > 0,
        'warnings': warnings
    })

# -------------------------------------------------------------------
# CUSTOMERS API
# -------------------------------------------------------------------
@api_bp.route('/customers', methods=['GET'])
@login_required
def get_customers(current_user):
    search = request.args.get('search', '')
    allergy_filter = request.args.get('allergy', '')
    diet_filter = request.args.get('diet', '')
    
    query = Customer.query
    
    if search:
        query = query.filter(
            (Customer.full_name.like(f"%{search}%")) |
            (Customer.phone.like(f"%{search}%")) |
            (Customer.email.like(f"%{search}%"))
        )
        
    if allergy_filter:
        query = query.join(CustomerAllergy).filter(CustomerAllergy.allergy_name == allergy_filter)
        
    if diet_filter:
        query = query.join(DietPreference).filter(DietPreference.preference_name == diet_filter)
        
    # Order by ID desc
    customers = query.order_by(Customer.id.desc()).all()
    return jsonify([c.to_dict() for c in customers])

@api_bp.route('/customers/<int:cid>', methods=['GET'])
@login_required
def get_customer(current_user, cid):
    customer = Customer.query.get_or_404(cid)
    
    # Fetch orders
    orders = Order.query.filter_by(customer_id=cid).order_by(Order.id.desc()).all()
    
    # Activity history related to this customer
    activities = ActivityLog.query.filter(ActivityLog.details.like(f"%Customer ID: {cid}%")).order_by(ActivityLog.id.desc()).all()
    
    response = customer.to_dict()
    response['order_history'] = [o.to_dict() for o in orders]
    response['activity_history'] = [a.to_dict() for a in activities]
    return jsonify(response)

@api_bp.route('/customers', methods=['POST'])
@login_required
def create_customer(current_user):
    data = request.json or {}
    
    full_name = data.get('full_name')
    if not full_name:
        return jsonify({'error': 'Bad Request', 'message': 'Full name is required'}), 400
        
    customer = Customer(
        full_name=full_name,
        phone=data.get('phone', ''),
        email=data.get('email', ''),
        gender=data.get('gender', ''),
        dob=data.get('dob', ''),
        address=data.get('address', ''),
        emergency_contact=data.get('emergency_contact', ''),
        preferred_contact=data.get('preferred_contact', 'Phone'),
        notes=data.get('notes', '')
    )
    
    db.session.add(customer)
    db.session.commit()
    
    # Process allergies
    allergies = data.get('allergies', [])
    for a in allergies:
        if isinstance(a, dict):
            name = a.get('allergy_name')
            severity = a.get('severity', 'Moderate')
            notes = a.get('notes', '')
        else:
            name = a
            severity = 'Moderate'
            notes = ''
            
        if name:
            ca = CustomerAllergy(customer_id=customer.id, allergy_name=name, severity=severity, notes=notes)
            db.session.add(ca)
            
    # Process diet preferences
    diets = data.get('diet_preferences', [])
    for d in diets:
        if d:
            dp = DietPreference(customer_id=customer.id, preference_name=d)
            db.session.add(dp)
            
    db.session.commit()
    
    log_activity(current_user.id, "Create Customer", f"Created profile for customer {customer.full_name}. Customer ID: {customer.id}")
    add_notification(f"New customer profile created: {customer.full_name}", "success")
    
    # If customer has severe allergies, trigger a warning notification
    severe_allergies = [a for a in customer.allergies if a.severity == 'Severe']
    if severe_allergies:
        add_notification(f"Customer {customer.full_name} has SEVERE allergies: {', '.join([a.allergy_name for a in severe_allergies])}", "warning")
        
    return jsonify(customer.to_dict()), 201

@api_bp.route('/customers/<int:cid>', methods=['PUT'])
@login_required
def update_customer(current_user, cid):
    customer = Customer.query.get_or_404(cid)
    data = request.json or {}
    
    customer.full_name = data.get('full_name', customer.full_name)
    customer.phone = data.get('phone', customer.phone)
    customer.email = data.get('email', customer.email)
    customer.gender = data.get('gender', customer.gender)
    customer.dob = data.get('dob', customer.dob)
    customer.address = data.get('address', customer.address)
    customer.emergency_contact = data.get('emergency_contact', customer.emergency_contact)
    customer.preferred_contact = data.get('preferred_contact', customer.preferred_contact)
    customer.notes = data.get('notes', customer.notes)
    
    # Allergy updates: drop old, insert new
    # First track old allergies for history logs
    old_allergies = [f"{a.allergy_name} ({a.severity})" for a in customer.allergies]
    
    CustomerAllergy.query.filter_by(customer_id=cid).delete()
    allergies = data.get('allergies', [])
    new_allergies = []
    for a in allergies:
        if isinstance(a, dict):
            name = a.get('allergy_name')
            severity = a.get('severity', 'Moderate')
            notes = a.get('notes', '')
        else:
            name = a
            severity = 'Moderate'
            notes = ''
            
        if name:
            new_allergies.append(f"{name} ({severity})")
            ca = CustomerAllergy(customer_id=cid, allergy_name=name, severity=severity, notes=notes)
            db.session.add(ca)
            
    # Diet updates: drop old, insert new
    DietPreference.query.filter_by(customer_id=cid).delete()
    diets = data.get('diet_preferences', [])
    for d in diets:
        if d:
            dp = DietPreference(customer_id=cid, preference_name=d)
            db.session.add(dp)
            
    db.session.commit()
    
    details = f"Updated details for {customer.full_name}. Customer ID: {customer.id}."
    if set(old_allergies) != set(new_allergies):
        details += f" Allergy changes: {', '.join(old_allergies)} -> {', '.join(new_allergies)}."
        add_notification(f"Allergies updated for customer {customer.full_name}", "info")
        
    log_activity(current_user.id, "Update Customer", details)
    return jsonify(customer.to_dict())

@api_bp.route('/customers/<int:cid>', methods=['DELETE'])
@login_required
def delete_customer(current_user, cid):
    customer = Customer.query.get_or_404(cid)
    name = customer.full_name
    db.session.delete(customer)
    db.session.commit()
    
    log_activity(current_user.id, "Delete Customer", f"Deleted customer {name}. Customer ID: {cid}")
    return jsonify({'message': f'Customer {name} deleted successfully'})

# -------------------------------------------------------------------
# INGREDIENTS API
# -------------------------------------------------------------------
@api_bp.route('/ingredients', methods=['GET'])
@login_required
def get_ingredients(current_user):
    category = request.args.get('category', '')
    query = Ingredient.query
    if category:
        query = query.filter_by(category=category)
    ingredients = query.order_by(Ingredient.name.asc()).all()
    return jsonify([i.to_dict() for i in ingredients])

@api_bp.route('/ingredients', methods=['POST'])
@login_required
def create_ingredient(current_user):
    data = request.json or {}
    name = data.get('name')
    if not name:
        return jsonify({'error': 'Bad Request', 'message': 'Ingredient name is required'}), 400
        
    # Check duplicate
    existing = Ingredient.query.filter_by(name=name).first()
    if existing:
        return jsonify({'error': 'Conflict', 'message': f"Ingredient '{name}' already exists"}), 409
        
    contains_allergens = data.get('contains_allergens', [])
    contains_str = ", ".join(contains_allergens) if isinstance(contains_allergens, list) else contains_allergens
    
    ing = Ingredient(
        name=name,
        category=data.get('category', 'Other'),
        contains_allergens=contains_str,
        description=data.get('description', ''),
        status=data.get('status', 'Active')
    )
    db.session.add(ing)
    db.session.commit()
    
    log_activity(current_user.id, "Create Ingredient", f"Created ingredient {name}. ID: {ing.id}")
    return jsonify(ing.to_dict()), 201

@api_bp.route('/ingredients/<int:iid>', methods=['PUT'])
@login_required
def update_ingredient(current_user, iid):
    ing = Ingredient.query.get_or_404(iid)
    data = request.json or {}
    
    old_name = ing.name
    ing.name = data.get('name', ing.name)
    ing.category = data.get('category', ing.category)
    
    contains_allergens = data.get('contains_allergens', [])
    contains_str = ", ".join(contains_allergens) if isinstance(contains_allergens, list) else contains_allergens
    ing.contains_allergens = contains_str
    
    ing.description = data.get('description', ing.description)
    ing.status = data.get('status', ing.status)
    
    db.session.commit()
    log_activity(current_user.id, "Update Ingredient", f"Updated ingredient {old_name} (ID: {iid}) -> {ing.name}")
    return jsonify(ing.to_dict())

@api_bp.route('/ingredients/<int:iid>', methods=['DELETE'])
@login_required
def delete_ingredient(current_user, iid):
    ing = Ingredient.query.get_or_404(iid)
    # Check if in use
    in_use = ProductIngredient.query.filter_by(ingredient_id=iid).first()
    if in_use:
        return jsonify({'error': 'Conflict', 'message': f"Cannot delete '{ing.name}' as it is used in products"}), 409
        
    name = ing.name
    db.session.delete(ing)
    db.session.commit()
    log_activity(current_user.id, "Delete Ingredient", f"Deleted ingredient {name} (ID: {iid})")
    return jsonify({'message': f"Ingredient '{name}' deleted successfully"})

# -------------------------------------------------------------------
# PRODUCTS API
# -------------------------------------------------------------------
@api_bp.route('/products', methods=['GET'])
@login_required
def get_products(current_user):
    category = request.args.get('category', '')
    query = Product.query
    if category:
        query = query.filter_by(category=category)
    products = query.order_by(Product.name.asc()).all()
    return jsonify([p.to_dict() for p in products])

@api_bp.route('/products/<int:pid>', methods=['GET'])
@login_required
def get_product(current_user, pid):
    product = Product.query.get_or_404(pid)
    return jsonify(product.to_dict())

@api_bp.route('/products', methods=['POST'])
@login_required
def create_product(current_user):
    data = request.json or {}
    name = data.get('name')
    category = data.get('category')
    price = data.get('price')
    
    if not name or not category or price is None:
        return jsonify({'error': 'Bad Request', 'message': 'Name, category, and price are required'}), 400
        
    existing = Product.query.filter_by(name=name).first()
    if existing:
        return jsonify({'error': 'Conflict', 'message': f"Product '{name}' already exists"}), 409
        
    product = Product(
        name=name,
        category=category,
        price=float(price),
        description=data.get('description', ''),
        status=data.get('status', 'Active')
    )
    db.session.add(product)
    db.session.commit()
    
    # Save product ingredients mapping
    ingredients = data.get('ingredients', []) # List of dict: {ingredient_id: int, notes: str}
    for ing in ingredients:
        ing_id = ing.get('ingredient_id')
        notes = ing.get('notes', '')
        if ing_id:
            pi = ProductIngredient(product_id=product.id, ingredient_id=ing_id, notes=notes)
            db.session.add(pi)
            
    db.session.commit()
    log_activity(current_user.id, "Create Product", f"Created product {name}. Product ID: {product.id}")
    return jsonify(product.to_dict()), 201

@api_bp.route('/products/<int:pid>', methods=['PUT'])
@login_required
def update_product(current_user, pid):
    product = Product.query.get_or_404(pid)
    data = request.json or {}
    
    product.name = data.get('name', product.name)
    product.category = data.get('category', product.category)
    product.price = float(data.get('price', product.price))
    product.description = data.get('description', product.description)
    product.status = data.get('status', product.status)
    
    # Ingredients refresh
    if 'ingredients' in data:
        ProductIngredient.query.filter_by(product_id=pid).delete()
        for ing in data.get('ingredients', []):
            ing_id = ing.get('ingredient_id')
            notes = ing.get('notes', '')
            if ing_id:
                pi = ProductIngredient(product_id=pid, ingredient_id=ing_id, notes=notes)
                db.session.add(pi)
                
    db.session.commit()
    log_activity(current_user.id, "Update Product", f"Updated product {product.name}. Product ID: {pid}")
    return jsonify(product.to_dict())

@api_bp.route('/products/<int:pid>', methods=['DELETE'])
@login_required
def delete_product(current_user, pid):
    product = Product.query.get_or_404(pid)
    name = product.name
    
    # Check if used in order items
    ordered = OrderItem.query.filter_by(product_id=pid).first()
    if ordered:
        return jsonify({'error': 'Conflict', 'message': f"Cannot delete '{name}' because it has been ordered previously"}), 409
        
    db.session.delete(product)
    db.session.commit()
    log_activity(current_user.id, "Delete Product", f"Deleted product {name}. Product ID: {pid}")
    return jsonify({'message': f"Product '{name}' deleted successfully"})

# -------------------------------------------------------------------
# ORDER CRUD & AUTOMATIC ALLERGY SAFETY CHECKS
# -------------------------------------------------------------------
@api_bp.route('/orders', methods=['GET'])
@login_required
def get_orders(current_user):
    status_filter = request.args.get('status', '')
    customer_id = request.args.get('customer_id', '')
    
    query = Order.query
    if status_filter:
        query = query.filter_by(status=status_filter)
    if customer_id:
        query = query.filter_by(customer_id=customer_id)
        
    orders = query.order_by(Order.id.desc()).all()
    return jsonify([o.to_dict() for o in orders])

@api_bp.route('/orders/<int:oid>', methods=['GET'])
@login_required
def get_order(current_user, oid):
    order = Order.query.get_or_404(oid)
    return jsonify(order.to_dict())

@api_bp.route('/orders', methods=['POST'])
@login_required
def create_order(current_user):
    data = request.json or {}
    
    customer_id = data.get('customer_id')
    delivery_date = data.get('delivery_date')
    items = data.get('items', [])  # [{product_id: int, quantity: int}]
    special_instructions = data.get('special_instructions', '')
    override_accepted = data.get('override_accepted', False)
    
    if not customer_id or not delivery_date or not items:
        return jsonify({'error': 'Bad Request', 'message': 'Customer ID, delivery date, and order items are required'}), 400
        
    customer = Customer.query.get(customer_id)
    if not customer:
        return jsonify({'error': 'Not Found', 'message': 'Customer not found'}), 404
        
    # Check for allergy warning
    warnings = check_allergies_for_items(customer_id, items)
    if warnings and not override_accepted:
        # Block placement and return warnings
        return jsonify({
            'error': 'AllergyWarning',
            'message': '🚨 ALLERGY WARNING: Dangerous ingredients detected for this customer. Action required.',
            'warnings': warnings
        }), 400
        
    # Initialize order
    order = Order(
        customer_id=customer_id,
        delivery_date=delivery_date,
        special_instructions=special_instructions,
        status='Pending',
        total_amount=0.0
    )
    db.session.add(order)
    db.session.commit()
    
    total_amount = 0.0
    for it in items:
        prod_id = it.get('product_id')
        qty = int(it.get('quantity', 1))
        product = Product.query.get(prod_id)
        if product:
            price = product.price
            total_amount += (price * qty)
            oi = OrderItem(
                order_id=order.id,
                product_id=prod_id,
                quantity=qty,
                price=price
            )
            db.session.add(oi)
            
    order.total_amount = total_amount
    db.session.commit()
    
    # Audit log details
    log_detail = f"Placed order ID: {order.id} for customer {customer.full_name}. Total: ${total_amount:.2f}."
    if warnings:
        log_detail += f" [ALLERGY OVERRIDE ACCEPTED: {', '.join([w['allergen'] for w in warnings])}]"
        log_activity(current_user.id, "Allergy Override", f"Override allergen warning for customer {customer.full_name} on Order ID: {order.id}. Details: {warnings}")
        add_notification(f"⚠️ Allergy warning overridden by {current_user.username} for order #{order.id} ({customer.full_name})", "danger")
    else:
        add_notification(f"New order #{order.id} placed for {customer.full_name}", "info")
        
    log_activity(current_user.id, "Create Order", log_detail)
    
    return jsonify(order.to_dict()), 201

@api_bp.route('/orders/<int:oid>', methods=['PUT'])
@login_required
def update_order_status(current_user, oid):
    order = Order.query.get_or_404(oid)
    data = request.json or {}
    
    old_status = order.status
    new_status = data.get('status')
    if not new_status:
        return jsonify({'error': 'Bad Request', 'message': 'Status parameter is required'}), 400
        
    valid_statuses = ['Pending', 'Preparing', 'Completed', 'Delivered', 'Cancelled']
    if new_status not in valid_statuses:
        return jsonify({'error': 'Bad Request', 'message': 'Invalid status'}), 400
        
    order.status = new_status
    db.session.commit()
    
    log_activity(current_user.id, "Update Order Status", f"Updated Order ID: {oid} status from {old_status} -> {new_status}")
    
    # Send notifications on completion/cancellation
    if new_status == 'Completed':
        add_notification(f"Order #{oid} is COMPLETED and ready for pickup/delivery!", "success")
    elif new_status == 'Cancelled':
        add_notification(f"Order #{oid} has been CANCELLED.", "warning")
        
    return jsonify(order.to_dict())

# -------------------------------------------------------------------
# DASHBOARD API
# -------------------------------------------------------------------
@api_bp.route('/dashboard/stats', methods=['GET'])
@login_required
def get_dashboard_stats(current_user):
    total_customers = Customer.query.count()
    total_orders = Order.query.count()
    
    # Customers with allergies (using unique distinct customer_id in CustomerAllergy)
    cust_with_allergies = db.session.query(CustomerAllergy.customer_id).distinct().count()
    
    # Customers with dietary preferences
    cust_with_diets = db.session.query(DietPreference.customer_id).distinct().count()
    
    # Today's orders
    today_str = date.today().isoformat()
    today_orders = Order.query.filter(Order.created_at >= datetime.combine(date.today(), datetime.min.time())).count()
    
    # Orders by Status
    pending_orders = Order.query.filter_by(status='Pending').count()
    preparing_orders = Order.query.filter_by(status='Preparing').count()
    completed_orders = Order.query.filter_by(status='Completed').count()
    delivered_orders = Order.query.filter_by(status='Delivered').count()
    cancelled_orders = Order.query.filter_by(status='Cancelled').count()
    
    # Recent activity logs (last 8)
    recent_activities = ActivityLog.query.order_by(ActivityLog.id.desc()).limit(8).all()
    
    # Recent customers (last 5)
    recent_customers = Customer.query.order_by(Customer.id.desc()).limit(5).all()
    
    # Recent orders (last 5)
    recent_orders = Order.query.order_by(Order.id.desc()).limit(5).all()
    
    return jsonify({
        'total_customers': total_customers,
        'total_orders': total_orders,
        'cust_with_allergies': cust_with_allergies,
        'cust_with_diets': cust_with_diets,
        'today_orders': today_orders,
        'status_counts': {
            'Pending': pending_orders,
            'Preparing': preparing_orders,
            'Completed': completed_orders,
            'Delivered': delivered_orders,
            'Cancelled': cancelled_orders
        },
        'recent_activities': [a.to_dict() for a in recent_activities],
        'recent_customers': [c.to_dict() for c in recent_customers],
        'recent_orders': [o.to_dict() for o in recent_orders]
    })

# -------------------------------------------------------------------
# REPORTS API
# -------------------------------------------------------------------
@api_bp.route('/reports/statistics', methods=['GET'])
@login_required
def get_reports_stats(current_user):
    # 1. Popular Allergies
    allergy_query = db.session.query(CustomerAllergy.allergy_name, db.func.count(CustomerAllergy.id)).group_by(CustomerAllergy.allergy_name).all()
    popular_allergies = [{'allergy': x[0], 'count': x[1]} for x in allergy_query]
    
    # 2. Diet preference stats
    diet_query = db.session.query(DietPreference.preference_name, db.func.count(DietPreference.id)).group_by(DietPreference.preference_name).all()
    diet_stats = [{'diet': x[0], 'count': x[1]} for x in diet_query]
    
    # 3. Popular products
    product_query = db.session.query(Product.name, db.func.sum(OrderItem.quantity))\
        .join(OrderItem, Product.id == OrderItem.product_id)\
        .group_by(Product.name).order_by(db.func.sum(OrderItem.quantity).desc()).limit(10).all()
    popular_products = [{'product': x[0], 'quantity': int(x[1])} for x in product_query]
    
    # 4. Sales Stats: Total revenue, count, average order value
    orders = Order.query.all()
    total_sales = sum([o.total_amount for o in orders if o.status != 'Cancelled'])
    completed_sales = sum([o.total_amount for o in orders if o.status == 'Delivered' or o.status == 'Completed'])
    
    # Monthly sales group
    # Group SQLite/MySQL compatibility: handle by python mapping of datetime
    monthly_sales = {}
    for o in orders:
        if o.status == 'Cancelled':
            continue
        # Get Month string e.g. "2026-06"
        m_str = o.created_at.strftime('%Y-%m')
        monthly_sales[m_str] = monthly_sales.get(m_str, 0.0) + o.total_amount
        
    monthly_sales_list = [{'month': k, 'amount': v} for k, v in sorted(monthly_sales.items())]
    
    return jsonify({
        'popular_allergies': popular_allergies,
        'diet_stats': diet_stats,
        'popular_products': popular_products,
        'total_sales': total_sales,
        'completed_sales': completed_sales,
        'monthly_sales': monthly_sales_list
    })

@api_bp.route('/reports/download', methods=['GET'])
@login_required
def download_report(current_user):
    rep_format = request.args.get('format', 'csv')
    rep_type = request.args.get('type', 'customers') # 'customers', 'orders', 'allergies'
    
    output = io.StringIO()
    writer = csv.writer(output)
    
    filename = f"{rep_type}_report_{datetime.now().strftime('%Y%m%d')}.csv"
    
    if rep_type == 'customers':
        writer.writerow(['ID', 'Full Name', 'Phone', 'Email', 'Gender', 'DOB', 'Preferred Contact', 'Allergies', 'Dietary Preferences'])
        customers = Customer.query.all()
        for c in customers:
            allergies_str = ", ".join([f"{a.allergy_name}({a.severity})" for a in c.allergies])
            diet_str = ", ".join([d.preference_name for d in c.diet_preferences])
            writer.writerow([c.id, c.full_name, c.phone, c.email, c.gender, c.dob, c.preferred_contact, allergies_str, diet_str])
            
    elif rep_type == 'orders':
        writer.writerow(['Order ID', 'Customer Name', 'Delivery Date', 'Status', 'Total Amount', 'Special Instructions', 'Date Created'])
        orders = Order.query.all()
        for o in orders:
            cust_name = o.customer.full_name if o.customer else 'Unknown'
            writer.writerow([o.id, cust_name, o.delivery_date, o.status, f"${o.total_amount:.2f}", o.special_instructions, o.created_at.strftime('%Y-%m-%d %H:%M')])
            
    elif rep_type == 'allergies':
        writer.writerow(['Allergy Name', 'Customer ID', 'Customer Name', 'Severity', 'Notes'])
        allergies = CustomerAllergy.query.all()
        for a in allergies:
            cust_name = a.customer.full_name if a.customer else 'Unknown'
            writer.writerow([a.allergy_name, a.customer_id, cust_name, a.severity, a.notes])
            
    else:
        writer.writerow(['Report type not found'])
        
    csv_data = output.getvalue()
    
    # If format is excel or csv, we return csv (Excel opens CSV files natively).
    # For PDF, since this is a light-weight build, we return a beautifully-styled printing-ready CSV/TXT spreadsheet stream
    # or HTML report representation that Excel and PDF converters accept.
    # To keep it production-ready and simple without heavy FPDF installs, CSV is the optimal format, marked as Excel-compatible.
    
    response = make_response(csv_data)
    response.headers["Content-Disposition"] = f"attachment; filename={filename}"
    response.headers["Content-type"] = "text/csv"
    return response

# -------------------------------------------------------------------
# NOTIFICATIONS API
# -------------------------------------------------------------------
@api_bp.route('/notifications', methods=['GET'])
@login_required
def get_notifications(current_user):
    notifs = Notification.query.order_by(Notification.id.desc()).limit(30).all()
    unread_count = Notification.query.filter_by(read=False).count()
    return jsonify({
        'notifications': [n.to_dict() for n in notifs],
        'unread_count': unread_count
    })

@api_bp.route('/notifications/<int:nid>/read', methods=['POST'])
@login_required
def mark_notification_read(current_user, nid):
    notif = Notification.query.get_or_404(nid)
    notif.read = True
    db.session.commit()
    return jsonify(notif.to_dict())

@api_bp.route('/notifications/read-all', methods=['POST'])
@login_required
def read_all_notifications(current_user):
    Notification.query.filter_by(read=False).update({Notification.read: True})
    db.session.commit()
    return jsonify({'message': 'All notifications marked as read'})

# -------------------------------------------------------------------
# ADMIN: USER CRUD
# -------------------------------------------------------------------
@api_bp.route('/admin/users', methods=['GET'])
@admin_required
def get_users(current_user):
    users = User.query.order_by(User.id.desc()).all()
    return jsonify([u.to_dict() for u in users])

@api_bp.route('/admin/users', methods=['POST'])
@admin_required
def create_user(current_user):
    data = request.json or {}
    username = data.get('username')
    password = data.get('password')
    role = data.get('role', 'staff')
    full_name = data.get('full_name', '')
    email = data.get('email', '')
    
    if not username or not password:
        return jsonify({'error': 'Bad Request', 'message': 'Username and password are required'}), 400
        
    existing = User.query.filter_by(username=username).first()
    if existing:
        return jsonify({'error': 'Conflict', 'message': f"Username '{username}' is already taken"}), 409
        
    user = User(username=username, role=role, full_name=full_name, email=email)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()
    
    log_activity(current_user.id, "Create User", f"Created user account for {username} with role {role}.")
    return jsonify(user.to_dict()), 201

@api_bp.route('/admin/users/<int:uid>', methods=['PUT'])
@admin_required
def update_user(current_user, uid):
    user = User.query.get_or_404(uid)
    data = request.json or {}
    
    # Don't allow changing own role if self-editing to avoid lockout
    if user.id == current_user.id and 'role' in data and data['role'] != 'admin':
        return jsonify({'error': 'Forbidden', 'message': 'You cannot downgrade your own admin privilege'}), 403
        
    user.username = data.get('username', user.username)
    user.role = data.get('role', user.role)
    user.full_name = data.get('full_name', user.full_name)
    user.email = data.get('email', user.email)
    
    password = data.get('password')
    if password:
        user.set_password(password)
        
    db.session.commit()
    log_activity(current_user.id, "Update User", f"Updated user account properties for {user.username}.")
    return jsonify(user.to_dict())

@api_bp.route('/admin/users/<int:uid>', methods=['DELETE'])
@admin_required
def delete_user(current_user, uid):
    user = User.query.get_or_404(uid)
    if user.id == current_user.id:
        return jsonify({'error': 'Forbidden', 'message': 'You cannot delete your own admin account'}), 403
        
    name = user.username
    db.session.delete(user)
    db.session.commit()
    log_activity(current_user.id, "Delete User", f"Deleted user account {name} (ID: {uid}).")
    return jsonify({'message': f"User account '{name}' deleted successfully"})

@api_bp.route('/admin/logs', methods=['GET'])
@admin_required
def get_activity_logs(current_user):
    logs = ActivityLog.query.order_by(ActivityLog.id.desc()).all()
    return jsonify([l.to_dict() for l in logs])

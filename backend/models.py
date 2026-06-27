from datetime import datetime

from werkzeug.security import check_password_hash, generate_password_hash

from database import db

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), nullable=False, default='staff')  # 'admin' or 'staff'
    full_name = db.Column(db.String(100))
    email = db.Column(db.String(100))
    is_password_set = db.Column(db.Boolean, default=True, nullable=False)
    password_token = db.Column(db.String(100), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'role': self.role,
            'full_name': self.full_name,
            'email': self.email,
            'is_password_set': self.is_password_set,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class Customer(db.Model):
    __tablename__ = 'customers'
    
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20))
    email = db.Column(db.String(100))
    gender = db.Column(db.String(15))
    dob = db.Column(db.String(10))  # YYYY-MM-DD
    address = db.Column(db.Text)
    emergency_contact = db.Column(db.String(100))  # "Name - Phone"
    preferred_contact = db.Column(db.String(20))  # "Phone", "Email", "SMS", "WhatsApp"
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    allergies = db.relationship('CustomerAllergy', backref='customer', cascade='all, delete-orphan', lazy=True)
    diet_preferences = db.relationship('DietPreference', backref='customer', cascade='all, delete-orphan', lazy=True)
    orders = db.relationship('Order', backref='customer', cascade='all, delete-orphan', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'full_name': self.full_name,
            'phone': self.phone,
            'email': self.email,
            'gender': self.gender,
            'dob': self.dob,
            'address': self.address,
            'emergency_contact': self.emergency_contact,
            'preferred_contact': self.preferred_contact,
            'notes': self.notes,
            'allergies': [a.to_dict() for a in self.allergies],
            'diet_preferences': [d.preference_name for d in self.diet_preferences],
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }


class CustomerAllergy(db.Model):
    __tablename__ = 'customer_allergies'
    
    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.id'), nullable=False)
    allergy_name = db.Column(db.String(50), nullable=False)
    severity = db.Column(db.String(20), nullable=False)  # 'Severe' (Red), 'Moderate' (Orange), 'Safe' (Green)
    notes = db.Column(db.String(255))

    def to_dict(self):
        return {
            'id': self.id,
            'customer_id': self.customer_id,
            'allergy_name': self.allergy_name,
            'severity': self.severity,
            'notes': self.notes
        }


class DietPreference(db.Model):
    __tablename__ = 'diet_preferences'
    
    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.id'), nullable=False)
    preference_name = db.Column(db.String(50), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'customer_id': self.customer_id,
            'preference_name': self.preference_name
        }


class Ingredient(db.Model):
    __tablename__ = 'ingredients'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    category = db.Column(db.String(50))  # e.g., Dairy, Nuts, Sweeteners, Flour
    contains_allergens = db.Column(db.String(255))  # Comma-separated list of simple allergens (e.g., "Milk, Gluten")
    description = db.Column(db.Text)
    status = db.Column(db.String(20), default='Active')  # 'Active', 'Inactive'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'category': self.category,
            'contains_allergens': [x.strip() for x in self.contains_allergens.split(',')] if self.contains_allergens else [],
            'contains_allergens_raw': self.contains_allergens or '',
            'description': self.description,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class Product(db.Model):
    __tablename__ = 'products'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    category = db.Column(db.String(50), nullable=False)  # Cake, Brownie, Cookie, Pastry, Cupcake, Bread, Dessert Box
    price = db.Column(db.Float, nullable=False)
    description = db.Column(db.Text)
    status = db.Column(db.String(20), default='Active')  # 'Active', 'Inactive'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationship to ingredients
    ingredients = db.relationship('ProductIngredient', backref='product', cascade='all, delete-orphan', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'category': self.category,
            'price': self.price,
            'description': self.description,
            'status': self.status,
            'ingredients': [pi.to_dict() for pi in self.ingredients],
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class ProductIngredient(db.Model):
    __tablename__ = 'product_ingredients'
    
    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    ingredient_id = db.Column(db.Integer, db.ForeignKey('ingredients.id'), nullable=False)
    notes = db.Column(db.String(255))  # e.g., "200g", "Topping"

    ingredient = db.relationship('Ingredient', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'product_id': self.product_id,
            'ingredient_id': self.ingredient_id,
            'ingredient_name': self.ingredient.name if self.ingredient else '',
            'category': self.ingredient.category if self.ingredient else '',
            'contains_allergens': [x.strip() for x in self.ingredient.contains_allergens.split(',')] if self.ingredient and self.ingredient.contains_allergens else [],
            'notes': self.notes
        }


class Order(db.Model):
    __tablename__ = 'orders'
    
    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.id'), nullable=False)
    delivery_date = db.Column(db.String(10), nullable=False)  # YYYY-MM-DD
    special_instructions = db.Column(db.Text)
    status = db.Column(db.String(20), default='Pending')  # Pending, Preparing, Completed, Delivered, Cancelled
    total_amount = db.Column(db.Float, default=0.0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    items = db.relationship('OrderItem', backref='order', cascade='all, delete-orphan', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'customer_id': self.customer_id,
            'customer_name': self.customer.full_name if self.customer else 'Unknown',
            'customer_phone': self.customer.phone if self.customer else '',
            'delivery_date': self.delivery_date,
            'special_instructions': self.special_instructions,
            'status': self.status,
            'total_amount': self.total_amount,
            'items': [item.to_dict() for item in self.items],
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }


class OrderItem(db.Model):
    __tablename__ = 'order_items'
    
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False, default=1)
    price = db.Column(db.Float, nullable=False)  # Price at purchase time

    product = db.relationship('Product', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'order_id': self.order_id,
            'product_id': self.product_id,
            'product_name': self.product.name if self.product else 'Unknown',
            'product_category': self.product.category if self.product else '',
            'quantity': self.quantity,
            'price': self.price,
            'subtotal': self.quantity * self.price
        }


class Notification(db.Model):
    __tablename__ = 'notifications'
    
    id = db.Column(db.Integer, primary_key=True)
    message = db.Column(db.String(255), nullable=False)
    type = db.Column(db.String(20), default='info')  # 'info', 'warning', 'success', 'danger'
    read = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'message': self.message,
            'type': self.type,
            'read': self.read,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class ActivityLog(db.Model):
    __tablename__ = 'activity_logs'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    action = db.Column(db.String(100), nullable=False)
    details = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship('User', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'username': self.user.username if self.user else 'System',
            'user_role': self.user.role if self.user else 'System',
            'action': self.action,
            'details': self.details,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

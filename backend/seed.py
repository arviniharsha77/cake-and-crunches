from datetime import datetime, timedelta

from app import create_app
from database import db
from models import (
    ActivityLog, Customer, CustomerAllergy, DietPreference, Ingredient,
    Notification, Order, OrderItem, Product, ProductIngredient, User
)

def seed_db():
    print("Seeding database...")
    
    # 1. Clean existing data
    db.drop_all()
    db.create_all()
    
    # 2. Add Users
    admin = User(
        username='admin', 
        role='admin', 
        full_name='System Admin', 
        email='admin@cakesandcrunches.com',
        is_password_set=True,
        password_token=None
    )
    admin.set_password('admin@123')
    
    staff = User(username='staff', role='staff', full_name='Bakery Staff', email='staff@cakesandcrunches.com')
    staff.set_password('staff@123')
    
    db.session.add(admin)
    db.session.add(staff)
    db.session.commit()
    print("Users seeded: admin/admin@123, staff/staff@123")
    
    # 3. Add Ingredients
    ingredients_data = [
        # Name, Category, Contains Allergens, Description, Status
        ("All-Purpose Flour", "Grains", "Gluten, Wheat", "Standard baking wheat flour", "Active"),
        ("Wheat Flour", "Grains", "Gluten, Wheat", "Whole wheat baking flour", "Active"),
        ("Granulated Sugar", "Sweeteners", "", "White refined cane sugar", "Active"),
        ("Unsalted Butter", "Dairy", "Milk", "Pure dairy butter", "Active"),
        ("Whole Milk", "Dairy", "Milk", "Full fat cow milk", "Active"),
        ("Heavy Cream", "Dairy", "Milk", "Thick whipping cream", "Active"),
        ("Cream Cheese", "Dairy", "Milk", "Soft cheese for frostings and cheesecakes", "Active"),
        ("Eggs", "Dairy/Poultry", "Egg", "Fresh farm eggs", "Active"),
        ("Peanuts", "Nuts", "Peanut", "Raw whole peanuts", "Active"),
        ("Almond Meal", "Nuts", "Tree Nuts", "Ground skinless almonds used as flour substitute", "Active"),
        ("Walnuts", "Nuts", "Tree Nuts", "Chopped walnut halves", "Active"),
        ("Cocoa Powder", "Other", "", "Unsweetened dark cocoa powder", "Active"),
        ("Dark Chocolate Chips", "Other", "Soy, Milk", "Semisweet baking chips", "Active"),
        ("Vanilla Extract", "Other", "", "Pure bourbon vanilla extract", "Active"),
        ("Fresh Strawberries", "Fruits", "", "Fresh organic strawberries", "Active"),
        ("Yeast", "Other", "", "Bakers active dry yeast", "Active"),
        ("Sesame Seeds", "Other", "Sesame", "White hulled sesame seeds for bread topping", "Active"),
    ]
    
    ingredients = {}
    for name, cat, allergens, desc, status in ingredients_data:
        ing = Ingredient(name=name, category=cat, contains_allergens=allergens, description=desc, status=status)
        db.session.add(ing)
        ingredients[name] = ing
        
    db.session.commit()
    print("Ingredients seeded.")
    
    # 4. Add Products
    products_data = [
        # Name, Category, Price, Description, Ingredients mappings list of (IngredientName, notes)
        ("Chocolate Fudge Cake", "Cake", 25.00, "Rich double-layer chocolate cake with fudge frosting.", [
            ("All-Purpose Flour", "250g"), ("Granulated Sugar", "200g"), ("Unsalted Butter", "150g"),
            ("Eggs", "3 pcs"), ("Whole Milk", "100ml"), ("Cocoa Powder", "50g"), ("Dark Chocolate Chips", "Topping")
        ]),
        ("Peanut Butter Brownie", "Brownie", 15.00, "Fudgy brownie with thick swirls of peanut butter.", [
            ("All-Purpose Flour", "150g"), ("Granulated Sugar", "150g"), ("Unsalted Butter", "100g"),
            ("Eggs", "2 pcs"), ("Peanuts", "80g"), ("Dark Chocolate Chips", "50g")
        ]),
        ("Almond Crunch Cookie", "Cookie", 3.50, "Crispy cookie loaded with almond meal and chopped nuts.", [
            ("All-Purpose Flour", "100g"), ("Almond Meal", "50g"), ("Granulated Sugar", "80g"), 
            ("Unsalted Butter", "60g"), ("Eggs", "1 pc")
        ]),
        ("Vanilla Cupcake", "Cupcake", 4.00, "Classic vanilla cupcake with sweet butter cream swirl.", [
            ("All-Purpose Flour", "120g"), ("Granulated Sugar", "100g"), ("Unsalted Butter", "80g"), 
            ("Eggs", "2 pcs"), ("Whole Milk", "50ml"), ("Vanilla Extract", "1 tsp")
        ]),
        ("Plain Sourdough Bread", "Bread", 6.00, "Traditional slow-fermented crusty sourdough loaf.", [
            ("Wheat Flour", "500g"), ("Yeast", "10g")
        ]),
        ("Sesame Sourdough Bread", "Bread", 7.00, "Traditional crusty sourdough topped with crunchy sesame seeds.", [
            ("Wheat Flour", "500g"), ("Yeast", "10g"), ("Sesame Seeds", "30g")
        ]),
        ("Strawberry Cheesecake", "Cake", 30.00, "Creamy baked New York cheesecake topped with fresh strawberries.", [
            ("Cream Cheese", "400g"), ("Heavy Cream", "150ml"), ("Granulated Sugar", "150g"), 
            ("Eggs", "2 pcs"), ("Fresh Strawberries", "150g")
        ]),
        ("Eggless Chocolate Cookie", "Cookie", 3.50, "Crispy chocolate chip cookie made without any eggs.", [
            ("All-Purpose Flour", "100g"), ("Granulated Sugar", "80g"), ("Unsalted Butter", "60g"), 
            ("Cocoa Powder", "20g"), ("Dark Chocolate Chips", "40g")
        ]),
        ("Gluten-Free Almond Cupcake", "Cupcake", 4.50, "Flourless cupcake made with almond meal.", [
            ("Almond Meal", "150g"), ("Granulated Sugar", "100g"), ("Unsalted Butter", "80g"), 
            ("Eggs", "2 pcs"), ("Vanilla Extract", "1 tsp")
        ]),
    ]
    
    products = {}
    for name, cat, price, desc, ing_maps in products_data:
        prod = Product(name=name, category=cat, price=price, description=desc, status="Active")
        db.session.add(prod)
        db.session.commit() # Commit to generate ID
        products[name] = prod
        
        for ing_name, notes in ing_maps:
            if ing_name in ingredients:
                pi = ProductIngredient(product_id=prod.id, ingredient_id=ingredients[ing_name].id, notes=notes)
                db.session.add(pi)
                
    db.session.commit()
    print("Products & Recipes seeded.")
    
    # 5. Add Customers
    customers_data = [
        # FullName, Phone, Email, Gender, DOB, Address, EmergencyContact, PreferredContact, Notes, AllergiesList, DietsList
        ("Alice Johnson", "555-0199", "alice@example.com", "Female", "1992-04-12", "123 Maple St, Springfield", "John Johnson (Husband) - 555-0198", "Phone", "Prefers afternoon pickups. Allergic to most nuts.", [
            ("Peanut", "Severe", "Anaphylaxis threat"), ("Tree Nuts", "Moderate", "Causes severe skin rashes")
        ], ["Vegetarian", "Low Carb"]),
        
        ("Bob Smith", "555-0144", "bob@example.com", "Male", "1985-09-23", "456 Oak Ln, Riverdale", "Jane Smith (Wife) - 555-0145", "Email", "Very strict vegan. Lactose intolerant.", [
            ("Milk", "Severe", "Lactose intolerant and hives"), ("Soy", "Moderate", "Causes digestive issues")
        ], ["Vegan", "Dairy Free"]),
        
        ("Charlie Brown", "555-0122", "charlie@example.com", "Male", "2010-10-31", "789 Pine Rd, Hill Valley", "Sally Brown (Mother) - 555-0121", "SMS", "Celiac disease. Severe gluten reaction.", [
            ("Wheat", "Severe", "Celiac disease crisis"), ("Gluten", "Severe", "Celiac disease crisis")
        ], ["Gluten Free"]),
        
        ("Diana Prince", "555-0177", "diana@example.com", "Female", "1988-02-28", "246 Amazon Way, Gateway", "Steve Trevor (Colleague) - 555-0176", "WhatsApp", "Prefers less sweet toppings.", [
            ("Egg", "Severe", "Causes difficulty breathing")
        ], ["Eggless", "Vegetarian"]),
        
        ("Ethan Hunt", "555-0107", "ethan@example.com", "Male", "1975-07-03", "101 Mission Rd, Langley", "Luther Stickell (Friend) - 555-0108", "Phone", "Prefers high protein keto ingredients.", [], ["Keto", "Low Sugar"]),
        ("Fiona Gallagher", "555-0155", "fiona@example.com", "Female", "1990-11-05", "2110 N Hoyne Ave, Chicago", "Lip Gallagher (Brother) - 555-0156", "SMS", "Watch out for hidden seeds.", [("Sesame", "Mild", "Causes minor itching")], ["Low Sugar"]),
        ("George Cooper", "555-0133", "george@example.com", "Male", "1980-01-15", "120 Sheldon Ln, Medford", "Mary Cooper (Wife) - 555-0134", "WhatsApp", "", [], ["Halal"]),
        ("Hannah Abbott", "555-0188", "hannah@example.com", "Female", "1998-05-18", "Leaky Cauldron, London", "Neville Longbottom (Husband) - 555-0189", "Phone", "Loves chocolate, no allergies.", [], ["Low Sugar"])
    ]
    
    customers = {}
    for c_info in customers_data:
        cust = Customer(
            full_name=c_info[0], phone=c_info[1], email=c_info[2], gender=c_info[3], dob=c_info[4],
            address=c_info[5], emergency_contact=c_info[6], preferred_contact=c_info[7], notes=c_info[8]
        )
        db.session.add(cust)
        db.session.commit() # Commit to get ID
        customers[cust.full_name] = cust
        
        # Allergies
        for name, severity, notes in c_info[9]:
            ca = CustomerAllergy(customer_id=cust.id, allergy_name=name, severity=severity, notes=notes)
            db.session.add(ca)
            
        # Diets
        for preference in c_info[10]:
            dp = DietPreference(customer_id=cust.id, preference_name=preference)
            db.session.add(dp)
            
    db.session.commit()
    print("Customers & Profiles seeded.")
    
    # 6. Add Orders (Past and Present)
    orders_data = [
        # CustomerName, DeliveryDateOffset, Status, Items (ProductName, qty), SpecialInstructions, Override
        ("George Cooper", -5, "Completed", [("Chocolate Fudge Cake", 1)], "Happy Birthday George!", False),
        ("Ethan Hunt", -2, "Completed", [("Gluten-Free Almond Cupcake", 6)], "Deliver before 8:00 AM.", False),
        ("Fiona Gallagher", -1, "Completed", [("Plain Sourdough Bread", 2)], "Slice one of them.", False),
        ("Alice Johnson", 0, "Pending", [("Vanilla Cupcake", 4)], "Ensure absolutely no peanuts in the icing.", False),
        ("Diana Prince", 1, "Preparing", [("Eggless Chocolate Cookie", 12)], "Needs neat individual packaging.", False),
        # Bob Smith order containing eggless chocolate cookies (butter/milk allergy override)
        ("Bob Smith", 2, "Preparing", [("Eggless Chocolate Cookie", 6)], "Bob requested this regardless of butter traces.", True),
        ("Charlie Brown", 3, "Pending", [("Gluten-Free Almond Cupcake", 4)], "Celiac patient - sanitise workspace.", False),
    ]
    
    for cust_name, date_offset, status, items_info, instructions, override in orders_data:
        cust = customers[cust_name]
        delivery_date = (datetime.now() + timedelta(days=date_offset)).strftime('%Y-%m-%d')
        
        order = Order(
            customer_id=cust.id,
            delivery_date=delivery_date,
            special_instructions=instructions,
            status=status,
            created_at=datetime.utcnow() + timedelta(days=date_offset - 1)
        )
        db.session.add(order)
        db.session.commit()
        
        total_amount = 0.0
        for prod_name, qty in items_info:
            prod = products[prod_name]
            price = prod.price
            total_amount += (price * qty)
            oi = OrderItem(order_id=order.id, product_id=prod.id, quantity=qty, price=price)
            db.session.add(oi)
            
        order.total_amount = total_amount
        db.session.commit()
        
        # Log activity
        log_detail = f"Placed order ID: {order.id} for customer {cust.full_name}. Total: ${total_amount:.2f}."
        if override:
            log_detail += " [ALLERGY OVERRIDE ACCEPTED]"
            log_act = ActivityLog(user_id=staff.id, action="Allergy Override", details=f"Overrode Milk allergy alert on Order #{order.id} for {cust.full_name}.")
            db.session.add(log_act)
            
        log_act_create = ActivityLog(user_id=staff.id, action="Create Order", details=log_detail)
        db.session.add(log_act_create)
        
    db.session.commit()
    print("Orders seeded.")
    
    # 7. Seed System Notifications
    notifications = [
        Notification(message="Allergy Warning Alert: Milk detected in Eggless Chocolate Cookie ordered by Bob Smith (Severe Allergy). Overridden by counter staff.", type="danger", read=False),
        Notification(message="Order #1 ready for pickup/delivery (George Cooper)", type="success", read=True),
        Notification(message="New customer registration: Hannah Abbott", type="info", read=True),
        Notification(message="New customer registration with severe allergy: Alice Johnson", type="warning", read=False),
    ]
    for n in notifications:
        db.session.add(n)
    db.session.commit()
    print("Notifications seeded.")
    
    print("Database seeding completed successfully!")

if __name__ == '__main__':
    app = create_app()
    with app.app_context():
        seed_db()

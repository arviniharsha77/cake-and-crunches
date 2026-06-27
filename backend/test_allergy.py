import json
import unittest

from app import create_app
from database import db
from models import Customer, Order, Product, User

class AllergySafetyTest(unittest.TestCase):
    
    def setUp(self):
        # Configure app for testing
        self.app = create_app()
        self.app.config['TESTING'] = True
        self.app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:' # in-memory db
        self.client = self.app.test_client()
        
        with self.app.app_context():
            db.create_all()
            self.seed_test_data()

    def tearDown(self):
        with self.app.app_context():
            db.session.remove()
            db.drop_all()

    def seed_test_data(self):
        from seed import seed_db
        # We can seed using seed_db or create minimal models
        # For precise testing let's run the seed script directly
        seed_db()

    def get_auth_headers(self, username="staff", password="staff123"):
        # Login to retrieve token/id
        res = self.client.post('/api/auth/login', json={
            'username': username,
            'password': password
        })
        data = json.loads(res.data.decode('utf-8'))
        user_id = data['user']['id']
        return {
            'Authorization': f'Bearer {user_id}',
            'Content-Type': 'application/json'
        }

    def test_allergy_check_endpoint(self):
        headers = self.get_auth_headers()
        
        # Find Alice Johnson (allergic to peanut)
        with self.app.app_context():
            alice = Customer.query.filter_by(full_name="Alice Johnson").first()
            alice_id = alice.id
            
            # Find Peanut Butter Brownie (contains peanut)
            p_brownie = Product.query.filter_by(name="Peanut Butter Brownie").first()
            p_brownie_id = p_brownie.id
            
            # Find Plain Sourdough Bread (no peanut, has gluten)
            p_sourdough = Product.query.filter_by(name="Plain Sourdough Bread").first()
            p_sourdough_id = p_sourdough.id

        # 1. Check Alice ordering Peanut Butter Brownies (Should return warnings)
        res = self.client.post('/api/orders/check', headers=headers, json={
            'customer_id': alice_id,
            'items': [{'product_id': p_brownie_id, 'quantity': 1}]
        })
        self.assertEqual(res.status_code, 200)
        data = json.loads(res.data.decode('utf-8'))
        self.assertTrue(data['has_warnings'])
        self.assertEqual(len(data['warnings']), 1)
        self.assertEqual(data['warnings'][0]['allergen'], 'Peanut')
        self.assertEqual(data['warnings'][0]['severity'], 'Severe')

        # 2. Check Alice ordering Sourdough Bread (No peanut warning, but she's not allergic to gluten)
        res = self.client.post('/api/orders/check', headers=headers, json={
            'customer_id': alice_id,
            'items': [{'product_id': p_sourdough_id, 'quantity': 1}]
        })
        self.assertEqual(res.status_code, 200)
        data = json.loads(res.data.decode('utf-8'))
        # Alice is not allergic to wheat/gluten in our mock seed, so it should be false!
        self.assertFalse(data['has_warnings'])

    def test_order_creation_blocks_on_allergy(self):
        headers = self.get_auth_headers()
        
        with self.app.app_context():
            alice = Customer.query.filter_by(full_name="Alice Johnson").first()
            p_brownie = Product.query.filter_by(name="Peanut Butter Brownie").first()
            alice_id = alice.id
            p_brownie_id = p_brownie.id

        # Attempt to create order without override. Should fail.
        res = self.client.post('/api/orders', headers=headers, json={
            'customer_id': alice_id,
            'delivery_date': '2026-06-30',
            'items': [{'product_id': p_brownie_id, 'quantity': 2}],
            'override_accepted': False
        })
        self.assertEqual(res.status_code, 400)
        data = json.loads(res.data.decode('utf-8'))
        self.assertEqual(data['error'], 'AllergyWarning')
        self.assertEqual(data['warnings'][0]['allergen'], 'Peanut')

        # Attempt to create order WITH override. Should succeed.
        res = self.client.post('/api/orders', headers=headers, json={
            'customer_id': alice_id,
            'delivery_date': '2026-06-30',
            'items': [{'product_id': p_brownie_id, 'quantity': 2}],
            'override_accepted': True
        })
        self.assertEqual(res.status_code, 201)
        data = json.loads(res.data.decode('utf-8'))
        self.assertIn('id', data)
        self.assertEqual(data['customer_name'], 'Alice Johnson')

if __name__ == '__main__':
    unittest.main()

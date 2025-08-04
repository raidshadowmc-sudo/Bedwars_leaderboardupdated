"""
Database initialization script for Render deployment
"""
import os
from app import app, db
import models

def init_database():
    """Initialize database tables"""
    with app.app_context():
        try:
            # Create all tables
            db.create_all()
            print("✓ Database tables created successfully!")
            
            # Add sample data if database is empty
            if models.Player.query.count() == 0:
                print("Adding sample data...")
                sample_players = [
                    {
                        'nickname': 'TestPlayer1',
                        'kills': 150,
                        'final_kills': 45,
                        'deaths': 120,
                        'beds_broken': 30,
                        'games_played': 50,
                        'wins': 35,
                        'experience': 15000,
                        'role': 'LEGEND',
                        'server_ip': 'play.example.com'
                    },
                    {
                        'nickname': 'TestPlayer2',
                        'kills': 89,
                        'final_kills': 23,
                        'deaths': 67,
                        'beds_broken': 18,
                        'games_played': 30,
                        'wins': 20,
                        'experience': 8500,
                        'role': 'DIAMOND',
                        'server_ip': 'play.example.com'
                    }
                ]
                
                for player_data in sample_players:
                    models.Player.add_player(**player_data)
                
                print("✓ Sample data added successfully!")
            
        except Exception as e:
            print(f"❌ Error initializing database: {e}")
            raise

if __name__ == '__main__':
    init_database()
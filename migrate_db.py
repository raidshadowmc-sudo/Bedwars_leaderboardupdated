#!/usr/bin/env python3
"""
Database migration script for Minecraft Bedwars Leaderboard
This script will migrate the old database schema to the new one
"""

import os
import sqlite3
from app import app, db
from models import Player

def migrate_database():
    """Migrate database from old schema to new schema"""
    
    # Database file path
    db_path = 'bedwars_leaderboard.db'
    old_data = []
    
    print("Starting database migration...")
    
    # Check if old database exists
    if os.path.exists(db_path):
        print("Found existing database, backing up...")
        
        # Create backup
        backup_path = f"{db_path}.backup"
        if os.path.exists(backup_path):
            os.remove(backup_path)
        os.rename(db_path, backup_path)
        
        # Read old data
        try:
            conn = sqlite3.connect(backup_path)
            cursor = conn.cursor()
            
            # Check if old table structure exists
            cursor.execute("PRAGMA table_info(player)")
            columns = [col[1] for col in cursor.fetchall()]
            
            if 'name' in columns and 'score' in columns:
                print("Migrating from old schema (name, score) to new schema...")
                cursor.execute("SELECT name, score FROM player")
                old_data = cursor.fetchall()
                print(f"Found {len(old_data)} records to migrate")
            
            conn.close()
            
        except Exception as e:
            print(f"Error reading old database: {e}")
            old_data = []
    
    # Create new database with new schema
    print("Creating new database schema...")
    with app.app_context():
        db.drop_all()
        db.create_all()
        
        # Migrate old data if any
        if old_data:
            print("Migrating old records...")
            for name, score in old_data:
                # Convert old score to experience and estimate other stats
                experience = score
                # Basic conversion estimates
                level = max(1, experience // 1000)
                kills = max(0, experience // 100)
                final_kills = max(0, kills // 10)
                deaths = max(1, kills // 2)
                beds_broken = max(0, final_kills // 2)
                
                player = Player(
                    nickname=name,
                    kills=kills,
                    final_kills=final_kills,
                    deaths=deaths,
                    beds_broken=beds_broken,
                    experience=experience,
                    role='Игрок'
                )
                db.session.add(player)
            
            db.session.commit()
            print(f"Successfully migrated {len(old_data)} records!")
        
        else:
            print("No old data to migrate. Creating fresh database.")
    
    print("Database migration completed successfully!")

if __name__ == '__main__':
    migrate_database()
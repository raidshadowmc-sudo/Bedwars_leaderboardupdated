from app import db
from datetime import datetime

class Player(db.Model):
    """Model for storing detailed player Bedwars statistics"""
    id = db.Column(db.Integer, primary_key=True)
    nickname = db.Column(db.String(100), nullable=False)
    kills = db.Column(db.Integer, default=0, nullable=False)
    final_kills = db.Column(db.Integer, default=0, nullable=False)
    deaths = db.Column(db.Integer, default=0, nullable=False)
    beds_broken = db.Column(db.Integer, default=0, nullable=False)
    games_played = db.Column(db.Integer, default=0, nullable=False)
    wins = db.Column(db.Integer, default=0, nullable=False)
    experience = db.Column(db.Integer, default=0, nullable=False)
    role = db.Column(db.String(50), default='Игрок', nullable=False)
    server_ip = db.Column(db.String(100), default='', nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f'<Player {self.nickname}: {self.experience} XP>'
    
    @property
    def kd_ratio(self):
        """Calculate kill/death ratio"""
        if self.deaths == 0:
            return self.kills if self.kills > 0 else 0
        return round(self.kills / self.deaths, 2)
    
    @property
    def win_rate(self):
        """Calculate win rate percentage"""
        if self.games_played == 0:
            return 0
        return round((self.wins / self.games_played) * 100, 1)
    
    @property
    def level(self):
        """Calculate player level based on experience"""
        if self.experience < 500:
            return 1
        elif self.experience < 1500:
            return 2
        elif self.experience < 3500:
            return 3
        elif self.experience < 7500:
            return 4
        elif self.experience < 15000:
            return 5
        else:
            return min(100, 5 + (self.experience - 15000) // 10000)
    
    @classmethod
    def get_leaderboard(cls, sort_by='experience', limit=50):
        """Get top players ordered by specified field"""
        if sort_by == 'experience':
            return cls.query.order_by(cls.experience.desc()).limit(limit).all()
        elif sort_by == 'kills':
            return cls.query.order_by(cls.kills.desc()).limit(limit).all()
        elif sort_by == 'final_kills':
            return cls.query.order_by(cls.final_kills.desc()).limit(limit).all()
        elif sort_by == 'beds_broken':
            return cls.query.order_by(cls.beds_broken.desc()).limit(limit).all()
        elif sort_by == 'kd_ratio':
            # Sort by K/D ratio, handling division by zero
            return sorted(cls.query.all(), key=lambda p: p.kd_ratio, reverse=True)[:limit]
        else:
            return cls.query.order_by(cls.experience.desc()).limit(limit).all()
    
    @classmethod
    def add_player(cls, nickname, kills=0, final_kills=0, deaths=0, beds_broken=0, games_played=0, wins=0, experience=0, role='Игрок', server_ip=''):
        """Add a new player to the leaderboard"""
        player = cls(
            nickname=nickname,
            kills=kills,
            final_kills=final_kills,
            deaths=deaths,
            beds_broken=beds_broken,
            games_played=games_played,
            wins=wins,
            experience=experience,
            role=role,
            server_ip=server_ip
        )
        db.session.add(player)
        db.session.commit()
        return player

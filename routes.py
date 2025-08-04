from flask import render_template, request, redirect, url_for, flash, session
from app import app
from models import Player
import os

# Admin password (в продакшене должен быть в переменных окружения)
ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', 'bedwars_admin_2025')

@app.route('/')
def index():
    """Display the leaderboard"""
    sort_by = request.args.get('sort', 'experience')
    players = Player.get_leaderboard(sort_by=sort_by)
    is_admin = session.get('is_admin', False)
    return render_template('index.html', players=players, current_sort=sort_by, is_admin=is_admin)

@app.route('/login', methods=['GET', 'POST'])
def login():
    """Admin login page"""
    if request.method == 'POST':
        password = request.form.get('password', '')
        if password == ADMIN_PASSWORD:
            session['is_admin'] = True
            flash('Добро пожаловать, администратор!', 'success')
            return redirect(url_for('index'))
        else:
            flash('Неверный пароль!', 'error')
    
    return render_template('login.html')

@app.route('/logout')
def logout():
    """Admin logout"""
    session.pop('is_admin', None)
    flash('Вы вышли из системы', 'success')
    return redirect(url_for('index'))

@app.route('/add', methods=['POST'])
def add_player():
    """Add a new player to the leaderboard (admin only)"""
    if not session.get('is_admin', False):
        flash('Доступ запрещен! Только администратор может добавлять игроков.', 'error')
        return redirect(url_for('index'))
    
    try:
        nickname = request.form.get('nickname', '').strip()
        kills = request.form.get('kills', type=int, default=0)
        final_kills = request.form.get('final_kills', type=int, default=0)
        deaths = request.form.get('deaths', type=int, default=0)
        beds_broken = request.form.get('beds_broken', type=int, default=0)
        games_played = request.form.get('games_played', type=int, default=0)
        wins = request.form.get('wins', type=int, default=0)
        experience = request.form.get('experience', type=int, default=0)
        role = request.form.get('role', '').strip() or 'Игрок'
        server_ip = request.form.get('server_ip', '').strip()
        
        # Validation
        if not nickname:
            flash('Ник не может быть пустым!', 'error')
            return redirect(url_for('index'))
        
        if len(nickname) > 20:
            flash('Ник не может быть длиннее 20 символов!', 'error')
            return redirect(url_for('index'))
        
        # Check for valid numbers
        for field, value in [('киллы', kills), ('финальные киллы', final_kills), 
                           ('смерти', deaths), ('кровати', beds_broken), 
                           ('игры', games_played), ('победы', wins), ('опыт', experience)]:
            if value is None or value < 0:
                flash(f'{field.capitalize()} должны быть неотрицательным числом!', 'error')
                return redirect(url_for('index'))
            if value > 999999:
                flash(f'{field.capitalize()} не могут превышать 999,999!', 'error')
                return redirect(url_for('index'))
        
        # Check logical consistency
        if wins > games_played:
            flash('Количество побед не может превышать количество игр!', 'error')
            return redirect(url_for('index'))
        
        Player.add_player(nickname, kills, final_kills, deaths, beds_broken, games_played, wins, experience, role, server_ip)
        flash(f'Игрок {nickname} добавлен в таблицу лидеров!', 'success')
        
    except Exception as e:
        app.logger.error(f"Error adding player: {e}")
        flash('Произошла ошибка при добавлении игрока!', 'error')
    
    return redirect(url_for('index'))

@app.route('/clear', methods=['POST'])
def clear_leaderboard():
    """Clear all players from the leaderboard (admin only)"""
    if not session.get('is_admin', False):
        flash('Доступ запрещен! Только администратор может очистить таблицу.', 'error')
        return redirect(url_for('index'))
    
    try:
        Player.query.delete()
        from app import db
        db.session.commit()
        flash('Таблица лидеров очищена!', 'success')
    except Exception as e:
        app.logger.error(f"Error clearing leaderboard: {e}")
        flash('Произошла ошибка при очистке таблицы!', 'error')
    
    return redirect(url_for('index'))

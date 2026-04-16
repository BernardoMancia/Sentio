#!/bin/bash
set -e

echo "=== App Triste - Deploy Script ==="
echo ""

APP_DIR="/opt/app-triste"
DB_NAME="app_triste"
DB_USER="apptriste"
DB_PASS="$(openssl rand -base64 24)"

echo "[1/6] Criando diretório..."
mkdir -p $APP_DIR
cd $APP_DIR

echo "[2/6] Instalando dependências do sistema..."
apt-get update -qq
apt-get install -y -qq python3 python3-pip python3-venv postgresql postgresql-contrib > /dev/null 2>&1

echo "[3/6] Configurando PostgreSQL..."
systemctl start postgresql
systemctl enable postgresql

sudo -u postgres psql -tc "SELECT 1 FROM pg_roles WHERE rolname='$DB_USER'" | grep -q 1 || \
    sudo -u postgres psql -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASS';"

sudo -u postgres psql -tc "SELECT 1 FROM pg_database WHERE datname='$DB_NAME'" | grep -q 1 || \
    sudo -u postgres createdb -O $DB_USER $DB_NAME

sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"
sudo -u postgres psql -d $DB_NAME -c "GRANT ALL ON SCHEMA public TO $DB_USER;"

echo "[4/6] Configurando ambiente Python..."
python3 -m venv $APP_DIR/venv
source $APP_DIR/venv/bin/activate
pip install --quiet --upgrade pip
pip install --quiet -r $APP_DIR/requirements.txt

echo "[5/6] Criando .env..."
cat > $APP_DIR/.env << EOF
DATABASE_URL=postgresql://$DB_USER:$DB_PASS@localhost:5432/$DB_NAME
HOST=0.0.0.0
PORT=8000
EOF

echo "[6/6] Criando serviço systemd..."
cat > /etc/systemd/system/app-triste.service << EOF
[Unit]
Description=App Triste API
After=network.target postgresql.service

[Service]
Type=simple
User=root
WorkingDirectory=$APP_DIR
Environment=PATH=$APP_DIR/venv/bin:/usr/bin
ExecStart=$APP_DIR/venv/bin/uvicorn main:app --host 0.0.0.0 --port 8000
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable app-triste
systemctl restart app-triste

echo ""
echo "========================================="
echo "  ✅ Deploy concluído!"
echo "========================================="
echo ""
echo "  API: http://82.112.245.99:8000"
echo "  Health: http://82.112.245.99:8000/api/health"
echo "  DB User: $DB_USER"
echo "  DB Pass: $DB_PASS"
echo ""
echo "  Comandos úteis:"
echo "    systemctl status app-triste"
echo "    journalctl -u app-triste -f"
echo "========================================="

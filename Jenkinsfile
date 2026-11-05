// Jenkinsfile – Next.js Standalone Build + Deploy via SSH (systemd: my-next-email-app)
pipeline {
  agent any

  environment {
    // --- Projekt & Ziel ---
    SERVICE_NAME       = 'my-next-email-app'
    PORT               = '3011'
    REMOTE_DIR         = '/var/www/html'
    REMOTE_SUBDIR      = 'MyNextEMailApp' // relativ zum Basisverzeichnis der SSH-Site
    REMOTE_PATH        = "${env.REMOTE_DIR}/${env.REMOTE_SUBDIR}"

    // --- Jenkins Plugins / Verbindungen ---
    SSH_SITE           = 'configStarato'
    GIT_URL            = 'git@github.com:uhwgmxorg/MyNextEMailApp.git'
    GIT_BRANCH         = 'main'
    GIT_CREDENTIALS_ID = '8ad1dfb8-c7bb-444e-bd10-4fe9473cb6cb'

    // --- Node / Next ---
    NODE_VERSION       = 'v20.19.0'
    NPM_CONFIG_CACHE   = "${env.JENKINS_HOME}/.npm"
    NEXT_TELEMETRY_DISABLED = '1'

    // --- Smoke via Apache ---
    PUBLIC_URL         = 'https://uhwgmxorg.online/MyNextEMailApp/' // TODO: pruefen
  }

  options {
    timestamps()
    disableConcurrentBuilds()
    buildDiscarder(logRotator(numToKeepStr: '10'))
  }

  stages {

    // =================================== Checkout ===========================
    stage('Checkout') {
      steps {
        checkout([
          $class: 'GitSCM',
          branches: [[name: "*/${GIT_BRANCH}"]],
          userRemoteConfigs: [[url: GIT_URL, credentialsId: GIT_CREDENTIALS_ID]]
        ])
      }
    }

    // =================================== Build ===========================
    stage('Build (Node 20 via nvm, standalone)') {
      steps {
        sh '''#!/usr/bin/env bash
set -euo pipefail

export NVM_DIR="${HOME}/.nvm"

if [ ! -s "${NVM_DIR}/nvm.sh" ]; then
  echo "[INFO] nvm not found, installing..."
  command -v curl >/dev/null || { echo "curl is required"; exit 1; }
  mkdir -p "${NVM_DIR}"
  curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash
fi

. "${NVM_DIR}/nvm.sh"
nvm install "${NODE_VERSION}"
nvm use "${NODE_VERSION}"

echo "Node: $(node -v)"
echo "npm : $(npm -v)"

export NPM_CONFIG_CACHE="${NPM_CONFIG_CACHE}"

if [ -f package-lock.json ]; then
  npm ci
else
  npm install
fi

# next.config.mjs setzt den basePath nur bei NODE_ENV=production
export NODE_ENV=production
export NEXT_BASE_PATH="/MyNextEMailApp"

npm run build

[ -f .next/standalone/server.js ] || { echo "Standalone-Output fehlt: .next/standalone/server.js"; exit 1; }

# --- Deploy-Paket als tar.gz schnueren ---
# Aufbau wie vom Service erwartet: server.js im Wurzelverzeichnis,
# dazu .next/static und public. Ein einzelnes Archiv umgeht Probleme des
# SFTP-Publishers mit Sonderzeichen in Dateinamen (.next/node_modules).
rm -rf dist && mkdir -p dist/pkg

cp -a .next/standalone/. dist/pkg/
mkdir -p dist/pkg/.next
cp -a .next/static dist/pkg/.next/static
[ -d public ] && cp -a public dist/pkg/public

tar czf dist/deploy.tar.gz -C dist/pkg .

[ -f dist/deploy.tar.gz ] || { echo "deploy.tar.gz fehlt"; exit 1; }
echo "Archiv erstellt:"
ls -la dist/deploy.tar.gz
'''
      }
    }

    // =================================== Deploy ===========================
    stage('Deploy Archive') {
      steps {
        sshPublisher(publishers: [
          sshPublisherDesc(
            configName: "${SSH_SITE}",
            verbose: true,
            transfers: [
              // 1) Service stoppen, Zielverzeichnis leeren (.env mit Mail-Zugangsdaten bleibt)
              sshTransfer(execCommand: """
set -e
sudo -n /bin/systemctl stop ${SERVICE_NAME} || true
sudo -n /bin/mkdir -p ${REMOTE_PATH}
sudo -n /bin/chown -R \$(id -un) ${REMOTE_PATH}
find ${REMOTE_PATH} -mindepth 1 -maxdepth 1 ! -name .env -exec rm -rf {} +
"""),
              // 2) Archiv hochladen
              sshTransfer(
                sourceFiles: 'dist/deploy.tar.gz',
                removePrefix: 'dist',
                remoteDirectory: "${REMOTE_SUBDIR}",
                flatten: false,
                cleanRemote: false
              )
            ]
          )
        ])
      }
    }

    // =================================== Install ===========================
    stage('Unpack on server + restart') {
      steps {
        sshPublisher(publishers: [
          sshPublisherDesc(
            configName: "${SSH_SITE}",
            verbose: true,
            transfers: [
              sshTransfer(execCommand: """
set -e
cd ${REMOTE_PATH}

# Archiv entpacken und aufraeumen
tar xzf deploy.tar.gz
rm -f deploy.tar.gz

[ -f server.js ] || { echo "server.js fehlt nach dem Entpacken"; exit 1; }

# Besitzer wie im systemd-Service (User=www-data)
sudo -n /bin/chown -R www-data:www-data ${REMOTE_PATH}

sudo -n /bin/systemctl start ${SERVICE_NAME}
sudo -n /bin/systemctl status ${SERVICE_NAME} --no-pager || true
""")
            ]
          )
        ])
      }
    }

    // =================================== Checks ===========================
    stage('Smoke-Checks') {
      steps {
        sshPublisher(publishers: [
          sshPublisherDesc(
            configName: "${SSH_SITE}",
            verbose: true,
            transfers: [
              sshTransfer(execCommand: """
set -e
sleep 3
echo "[Smoke] Backend direkt (127.0.0.1:${PORT}) HEAD:"
curl -fsSI "http://127.0.0.1:${PORT}/MyNextEMailApp/" | sed -n '1,8p' || true
""")
            ]
          )
        ])

        sh '''#!/usr/bin/env bash
set -e
echo "[Smoke] Über Apache/HTTPS (Prefix-Check):"
curl -fsSL "${PUBLIC_URL}" | grep -o "/MyNextEMailApp/_next/static" | head -n1
'''
      }
    }
  }

  post {
    success {
      echo "✅ ${env.SERVICE_NAME}: Build & Deploy erfolgreich."
      cleanWs()
    }
    unstable {
      echo "⚠️ ${env.SERVICE_NAME}: UNSTABLE – bitte Logs checken."
      cleanWs()
    }
    failure {
      echo "❌ ${env.SERVICE_NAME}: Build/Deploy failed. Logs prüfen."
      cleanWs()
    }
  }
}

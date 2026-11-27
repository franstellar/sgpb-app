# 📱 SGPB App — Aplicativo Paelito (ABADEUS)

![React Native](https://img.shields.io/badge/React_Native-Expo-000020?style=for-the-badge&logo=expo&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-Offline_First-003B57?style=for-the-badge&logo=sqlite&logoColor=white)
![Platform](https://img.shields.io/badge/Platform-Android%20%7C%20Web-3DDC84?style=for-the-badge&logo=android&logoColor=white)

Aplicativo mobile desenvolvido em **React Native (Expo)** para o **Sistema de Gestão de Paella Beneficente (SGPB)**, criado para apoiar a **12ª Edição Solidária da Paella Beneficente ABADEUS** (Criciúma/SC — 28/11/2026).

O app integra-se à API REST em Spring Boot (`sgpb-api`) e conta com banco local em **SQLite (`expo-sqlite`)** para garantir operação em contingência offline no dia do evento.

---

## 📋 Índice

- [Arquitetura e Stack](#-arquitetura-e-stack)
- [Funcionalidades por Perfil](#-funcionalidades-por-perfil)
- [Contingência Offline (SQLite)](#-contingência-offline-sqlite)
- [Como Executar](#-como-executar)
- [Credenciais de Teste](#-credenciais-de-teste)
- [Build Android (APK via Expo EAS)](#-build-android-apk-via-expo-eas)

---

## 🧱 Arquitetura e Stack

| Camada | Tecnologia / Biblioteca |
| :--- | :--- |
| **Framework Mobile** | React Native com Expo |
| **Comunicação com API** | Fetch API centralizada em `src/services/api.js` (detecção automática Web/Mobile) |
| **Persistência Local / Offline** | `expo-sqlite` (`src/db.js`) |
| **Leitura de QR Code** | `expo-camera` |
| **Geração de QR Code Real** | `react-native-qrcode-svg` |
| **Exportação de Relatórios** | `expo-file-system` + `expo-sharing` (CSV) |

---

## ✨ Funcionalidades por Perfil

O aplicativo adapta a navegação e as permissões conforme o perfil autenticado pela API:

### 🛒 Apoiador (Comprador)
- Cadastro e login integrados à API (`/api/auth/register` e `/api/auth/login`).
- Visualização do cardápio atualizado em tempo real (`GET /api/events/1/products`).
- Checkout com opção de **doação pedagógica extra (+ R$ 5,00)** (`donationAmount`).
- Criação de pedido (`PENDING`) com reserva de estoque por 15 minutos, pagamento via Pix com **QR Code real** e confirmação (`PAID`).
- Emissão de ingresso digital com **QR Code real** contendo o número do pedido para retirada no drive-thru.

### 📷 Voluntário (Check-in / Drive-thru)
- Acesso restrito às telas operacionais de **Check-in** e conferência de pedidos (sem exposição de indicadores financeiros ou reembolsos).
- Leitura do QR Code do ingresso pela câmera (`expo-camera`).
- Consulta do resumo do pedido antes da entrega (`GET /api/orders/by-number/{orderNumber}`) e confirmação de baixa (`POST /api/pickups/validate`) com **bloqueio contra dupla retirada**.

### 🤝 Parceiro (Ponto de Venda)
- Interface dedicada para registro de vendas vinculadas ao ponto parceiro (`origin: 'PARTNER'`), sem acesso aos dados financeiros gerais do evento.

### 🛠️ Administrador
- **Dashboard:** indicadores consolidados de arrecadação, vendas e operação (`GET /api/orders/dashboard`).
- **Gestão de Pedidos:** visualização da trilha de auditoria (`OrderStatusHistory`), cancelamento, **reembolso com justificativa obrigatória** e **exportação de pedidos em CSV** (restrita ao perfil `ADMIN`).
- **Estoque, Lotes e Equipe:** controle de disponibilidade dos produtos, criação de lotes e cadastro de equipe (`/api/auth/staff`).

---

## 📡 Contingência Offline (SQLite)

Para evitar interrupções no drive-thru em caso de oscilação de internet no dia do evento, o aplicativo utiliza `expo-sqlite` (`src/db.js`) como camada de contingência:
- Sincronização prévia de pedidos pagos via `GET /api/pickups/sync-data`.
- Validação local de retiradas com bloqueio de duplicidade caso a API esteja indisponível.
- Envio das baixas realizadas offline assim que a conexão for restabelecida (`POST /api/pickups/sync-offline`).

---

## 🚀 Como Executar

> **Pré-requisito:** a API [`sgpb-api`](../sgpb-api) precisa estar em execução em `http://localhost:8080`.

### 1. Clonar e instalar dependências
```bash
git clone <URL_DO_REPOSITORIO>
cd sgpb-app
npm install
```

### 2. Rodar no navegador (recomendado para avaliação local)
```bash
npx expo start --web
```
No modo web, o arquivo `src/services/api.js` detecta `Platform.OS === 'web'` e aponta automaticamente para `http://localhost:8080/api`.

### 3. Rodar no celular físico (Expo Go)
1. Descubra o IP local da sua máquina na rede Wi-Fi:
   - **Linux:** `hostname -I`
   - **Windows:** `ipconfig`
2. Atualize a constante `LOCAL_IP` em `src/services/api.js`:
   ```js
   const LOCAL_IP = 'SEU_IP_LOCAL';
   ```
3. Inicie o Expo e escaneie o QR Code no aplicativo **Expo Go** (celular e computador na mesma rede Wi-Fi):
   ```bash
   npx expo start
   ```

---

## 🔐 Credenciais de Teste

| Perfil | E-mail | Senha | Permissões |
| :--- | :--- | :--- | :--- |
| **Administrador** | `admin@abadeus.com.br` | `ADM123` | Acesso total (Dashboard, Pedidos, CSV, Estoque, Equipe e Check-in) |
| **Voluntário** | `voluntario@abadeus.com.br` | `VOL123` | Check-in com câmera e conferência de pedidos |
| **Parceiro** | `parceiro@abadeus.com.br` | `PAR123` | Registro de vendas de ponto parceiro |

---

## 📦 Build Android (APK via Expo EAS)

A build de distribuição Android gerada via **Expo EAS** está disponível no link abaixo (também acessível pelo QR Code do botão **BAIXE O APP!** no site institucional):

- **Download do Build:** [Expo EAS Build — sgpb-app](https://expo.dev/accounts/franboises-team/projects/sgpb-app/builds/db99d3e3-a10d-4f46-bac8-b3fe3ed9432e)

> **Observação para avaliação:** como o backend roda localmente (`localhost`), para testar todas as integrações com a API rodando na sua máquina, execute o aplicativo via `npx expo start --web` ou pelo **Expo Go** com o `LOCAL_IP` ajustado.

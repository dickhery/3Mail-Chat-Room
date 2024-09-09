
# 3Mail Chat Room

3Mail Chat Room is a decentralized chat application built on the Internet Computer blockchain. This project combines the power of blockchain with a fun, interactive chat room experience, allowing users to communicate securely and manage their identities in a decentralized manner.

## Features

### 1. **User Authentication**
   - Users can log in using their Internet Identity.
   - Users who do not log in are automatically assigned an NPC-style username (e.g., NPC-1234) to participate in the chat.

### 2. **Username Management**
   - **Create Username:** 
     - Users can create a username after logging in. A "Create Username" button is displayed, which reveals a text input and "Submit" button when clicked.
   - **Change Username:** 
     - Users can change their username after 24 hours. The "Change Username" button is displayed after the cooldown period.

### 3. **Admin Features**
   - Admins can delete messages in the chat room.
   - Admins log out using a dedicated "Admin Logout" button, which is only visible for users with admin privileges.

### 4. **Real-time Chat**
   - Messages are updated in real-time, with new messages appearing at the bottom of the chat box.
   - Users can manually scroll to the latest messages with the "Scroll to New" button.

### 5. **UI/UX Improvements**
   - **Dynamic UI Components:**
     - The UI adjusts to show relevant buttons and inputs based on user states (e.g., logged in, admin privileges).
   - **Mobile-Responsive Design:** 
     - Optimized for mobile use.
   - **Custom Styling:** 
     - Custom colors, fonts, and playful designs, including Comic Sans for a casual feel.

### 6. **Message Viewing & Interaction**
   - **Message Timestamps:**  
     - Each message includes a timestamp.
   - **Message Deletion:**  
     - Admins can delete messages, which disappear for all users in real-time.

### 7. **Decentralized Technology**
   - The chat room and its functionalities are hosted on the Internet Computer blockchain, ensuring decentralization, security, and persistence.

## Credits

- **Created by Richard Hery**  
  Visit [RichardHery.com](http://richardhery.com) for more projects and updates.

## How to Run Locally

To run the project locally from scratch, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/dickhery/3Mail-Chat-Room
   cd 3Mail-Chat-Room
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local Internet Computer replica:**
   ```bash
   dfx start --background --clean
   ```

4. **Generate necessary canister IDs:**
   ```bash
   dfx generate
   ```

5. **Build the project:**
   ```bash
   dfx build
   ```

6. **Update canister IDs:**
   - In the `canister_ids.json` file, replace the placeholder canister IDs with your own.
   - Hardcode the admin PID in the `main.mo` file under `allowedAdmins` to give admin access.

7. **Deploy the canisters locally:**
   ```bash
   dfx deploy
   ```

## How to Deploy On-Chain (deploy locally first)

### Step 1: Install the DFX Command Line Tool

If you don't already have the `dfx` tool installed, you need to install it. Run the following command to install `dfx`:

```bash
sh -ci "$(curl -fsSL https://internetcomputer.org/install.sh)"
```

After installation, confirm that `dfx` is set up by checking the version:

```bash
dfx --version
```

Make sure you have the required dependencies, such as Node.js and npm, installed. If not, you can install them:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/get-npm)

### Step 2: Prepare for Deployment

1. **Ensure you have enough cycles:**
   - Manage cycles through the [NNS dApp](https://nns.ic0.app/) and ensure that you have enough cycles to deploy canisters on the Internet Computer.

2. **Update `canister_ids.json`:**
   - In the `canister_ids.json` file, replace the placeholder canister IDs with your own canister IDs. These canister IDs must be ones you own and control via your NNS console.
   - Hardcode the admin PID in the `main.mo` file by adding your Principal ID to the `allowedAdmins` array for admin access.

### Step 3: Deploy to the Internet Computer

1. **Deploy the canisters to the mainnet using the following command:**
   ```bash
   dfx deploy --network ic
   ```

2. **Access the deployed chat room:**
   - Once deployed, your chat room will be accessible via a URL like:
     ```
     https://<your-canister-id>.ic0.app
     ```

## Live Demo

You can try this app live on the Internet Computer at:  
[3Mail Chat Room Live](https://bnze3-uyaaa-aaaam-adblq-cai.icp0.io/)

## Future Improvements

- **UI Enhancements:** Further UI refinements for improved accessibility.
- **Admin Features:** Expanded tools for admins to manage chat content.
- **Localization Support:** Multi-language support is planned for future updates.
- **Analytics:** Add analytics to track chat room activity.

## Contributing

We welcome contributions to the project! Submit a pull request or open an issue to discuss your proposed changes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

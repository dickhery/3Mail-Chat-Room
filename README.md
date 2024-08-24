
# 3Mail Chat Room

**3Mail Chat Room** is a decentralized chat room built on the Internet Computer (ICP) blockchain. This application allows users to participate in a chat room where they can send and receive messages in real-time. The messages are stored on-chain, ensuring privacy and security, with the ability for users to create custom usernames associated with their Internet Identity (II) to personalize their chat experience.

## Features

- **Decentralized Chat:** Users can participate in a fully decentralized chat room hosted on the Internet Computer.
- **Username Customization:** Users can create a custom username linked to their Internet Identity (II). This username is stored on-chain and is persistent across sessions and devices.
- **Real-Time Message Updates:** The chat room updates in real-time, displaying new messages as they are added by other users.
- **Unseen Message Counter:** A counter displays the number of messages that have been added to the chat but have not yet been viewed by the user.
- **Auto-Scrolling:** The chat automatically scrolls to the newest message when a user submits a new message, ensuring they see their latest input.

## Getting Started

### Prerequisites

- Node.js (for local development)
- DFX SDK (to deploy and interact with Internet Computer canisters)
- Internet Identity (for custom username functionality)

### Downloading the Repository

1. Clone the repository from GitHub:

   ```bash
   git clone https://github.com/dickhery/3Mail-Chat-Room.git
   cd 3Mail-Chat-Room
   ```

### Starting the Local Replica

To test 3Mail Chat Room locally:

1. Start the DFX replica:

   ```bash
   dfx start --background
   ```

2. Deploy the canisters locally:

   ```bash
   dfx deploy
   ```

### Configuring Canisters for Mainnet Deployment

Before deploying to the Internet Computer mainnet:

1. **Create Canisters on the NNS:**
   - Log in to the [Network Nervous System (NNS)](https://nns.ic0.app/) and create your frontend and backend canisters.
   - Make sure to note the canister IDs, as you'll need to add them to your project.

2. **Add Your Internet Identity as a Controller:**
   - Once the canisters are created, add your DFX Internet Identity as a controller of these canisters. This allows you to manage the canisters and deploy code to them.

3. **Update the `canister_ids.json` File:**
   - After creating your canisters, update the `canister_ids.json` file in the `.dfx` directory with your new canister IDs.
   - This step ensures your deployment targets the correct canisters on the mainnet.

4. **Deploy to Mainnet:**
   - Redeploy the application to the mainnet with the following command:

   ```bash
   dfx deploy --network ic
   ```

### Accessing the Application

Once deployed, your application will be accessible via a URL like:

```
https://<your-canister-id>.ic0.app
```

You can also visit the live version of this app at:

```
https://bnze3-uyaaa-aaaam-adblq-cai.icp0.io/
```

This URL will allow users to access the chat room, where they can log in with Internet Identity to create a username or chat as a guest.

### Using 3Mail Chat Room

1. **Joining the Chat:**
   - Users can join the chat room as a guest or log in with Internet Identity to create a custom username.
   - Guests are assigned a semi-unique "NPC-XXXX" username for anonymity.

2. **Creating a Custom Username:**
   - Users who log in with Internet Identity have the option to create a custom username that will be associated with their Principal ID (PID).
   - Once created, the username is persistent and will be used whenever the user logs in.

3. **Chat Room Functionality:**
   - The chat room updates in real-time, displaying new messages as they are added.
   - A counter shows how many new messages have been added since the user last viewed the chat.
   - Users can scroll through the chat history and use the "Scroll to New" button to jump to the latest messages.

### Customization

- **Admin PIDs:**
  - Modify the `main.mo` file to add or change the list of approved Principal IDs if you want to implement any admin-specific functionality in the future.

- **Styling:**
  - Customize the `index.scss` file to change the look and feel of the chat room.

- **Icon Customization:**
  - The app includes an icon that appears when users add the chat room to their home screen. To change this icon, replace the `icon.png` file in the `public/` directory with a new image (recommended size: 192x192 pixels).

### Credits

- **3Mail Chat Room** is brought to you by [RichardHery.com](https://richardhery.com).
- RichardHery.com also provides [3Mail.us](https://3mail.us), offering cool web3 messaging capabilities on the Internet Computer Protocol blockchain.

### Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue.

### License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### Acknowledgments

- Built using the DFINITY Internet Computer SDK.
- Inspired by the need for secure and decentralized communication tools.

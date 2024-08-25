
# 3Mail Chat Room

3Mail Chat Room is a decentralized chat application built on the Internet Computer blockchain. This project combines the power of blockchain with a fun, interactive chat room experience, allowing users to communicate securely and manage their identities in a decentralized manner.

## Features

### 1. **User Authentication**
   - Users can log in using their Internet Identity.
   - Users who do not log in are automatically assigned an NPC-style username (e.g., NPC-1234) to participate in the chat.

### 2. **Username Management**
   - **Create Username:** 
     - Users can create a custom username after logging in.
     - The "Create Username" button is displayed initially. Upon clicking, an input field and "Submit" button appear to allow the user to choose their username.
   - **Change Username:** 
     - After creating a username, users must wait 24 hours before they can change it.
     - The "Change Username" button becomes visible after 24 hours have passed since the last username change or creation.
     - When clicked, the "Change Username" button is replaced by an input field and a "Submit" button for the new username.

### 3. **Admin Features**
   - Admins can delete messages in the chat room.
   - Admins can log out using a dedicated "Admin Logout" button, which only appears for users with admin privileges.

### 4. **Real-time Chat**
   - Messages are updated in real-time, with new messages appearing at the bottom of the chat box.
   - The chat box automatically scrolls to the newest message when new messages are received.
   - Users can manually scroll to the latest messages by clicking the "Scroll to New" button.

### 5. **UI/UX Improvements**
   - **Dynamic UI Components:**
     - The UI dynamically adjusts to show only relevant buttons and inputs based on the user's current state (e.g., logged in, username created, admin privileges).
   - **Cleaner Layout:**
     - The layout has been refined to ensure that buttons and input fields only appear when necessary, reducing clutter and improving user experience.
   - **Mobile-Responsive Design:**
     - The chat room is designed to be mobile-responsive, ensuring a smooth user experience on different devices.
   - **Custom Styling:**
     - The application features a custom design with playful fonts and color schemes, including Comic Sans for a more casual feel.

### 6. **Message Viewing & Interaction**
   - **Message Timestamps:**
     - Each message displays a timestamp indicating when it was sent.
   - **Message Deletion:**
     - Admins can delete messages, which immediately disappear from the chat for all users.

### 7. **Decentralized Technology**
   - The chat room and all its functionalities are hosted on the Internet Computer blockchain, ensuring decentralization, security, and persistence.

## Credits

- **Created by Richard Hery**
  - Visit [RichardHery.com](http://richardhery.com) for more projects and updates.
- **Contributors:**
  - Thanks to the community for continuous feedback and contributions.

## How to Run

To run the project locally, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone <repository_url>
   cd 3Mail-Chat-Room
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

4. **Deploy to the Internet Computer:**
   - Ensure you have `dfx` installed.
   - Deploy the frontend and backend canisters:
     ```bash
     dfx deploy
     ```

## Future Improvements

- **Continued UI Enhancements:** Further refinement of the user interface to improve accessibility and user experience.
- **Expanded Admin Features:** Additional tools for admins to manage chat content and users.
- **Localization Support:** Plans to support multiple languages in the chat room.
- **Advanced Analytics:** Implementing analytics to track usage and interactions within the chat.

## Contributing

We welcome contributions to the project! Please submit a pull request or open an issue to discuss the changes you wish to make.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
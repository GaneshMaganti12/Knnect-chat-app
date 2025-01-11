# Knnect: Real-Time Chat Application

## Overview

**Knnect** is a real-time chat application designed to facilitate seamless one-to-one communication between users. It incorporates advanced features like user authentication, message reactions, emoji support, and secure communication using modern technologies. The application ensures an optimal user experience with responsive design and robust backend support.

## Features

### Authentication & Authorization

1. **User Authentication and Authorization**: Implemented using Firebase and JSON Web Tokens (JWT).
2. **Google Authentication**: Users can sign in using their Google accounts via Firebase.
3. **Forget Password**: Password reset functionality implemented using Firebase.
4. **Change Password**: Users can securely change their passwords using Firebase.
5. **Sign-Out**: Secure sign-out functionality implemented using JWT and local storage.
6. **Auto Sign-Out**: Automatically logs users out when the JWT token expires.

### Messaging Features

1. **One-to-One Chat Communication**: Real-time messaging implemented using Socket.io on both the frontend and backend.
2. **Message Deletion**: Users can delete messages they sent within two minutes. Deleting a message removes it for both the sender and receiver and updates the latest message with the respective date.
3. **Message Reactions**: Users can react to received messages.
4. **Emoji Support**: Users can send emojis in their messages.
5. **Date-Wise Messages**: Messages are grouped by their respective dates, with time displayed for each message.
6. **Sender Priority**: If a user sends a message to another user who isn’t in their chat list, the sender’s chat is added to the list with the message and date.
7. **Top Priority Chats**: The latest interaction is displayed at the top of the chat list.

### User Management

1. **My Profile**: Users can view their profile details and delete their accounts.
2. **Active Users**: Displays users who are currently online.
3. **Add Users**: Users can view a list of registered users and add them to their chat list by clicking on their profiles.
4. **Protected Routes**: Unauthorized users are redirected to the login page. Logged-in users are redirected to the chat page when accessing login or signup pages.
5. **Account Deletion**: Deletes the user’s account and redirects them to the login page.

### UI/UX Features

1. **Responsive Design**:
   - Desktop View: Chat and message components are displayed side-by-side.
   - Mobile View: Chat and message components are displayed individually based on screen size using `react-responsive`.
2. **Toast Notifications**: Errors and status updates are displayed using `react-toastify`.
3. **Form Validations**: User input is validated using YUP.
4. **Image Upload**: Users can upload profile images during signup.
5. **User Details**: Displays the profile details of users in the chat list.

### Backend Features

1. **REST API**: Backend integrated with frontend using Axios for data communication.
2. **Socket.io Integration**: Enables real-time communication between users.
3. **Email Notifications**: Sign up, Account delete, and Password reset emails are sent using Nodemailer.
4. **Protected Routes**: Middleware ensures secure access to authenticated routes.

### Technology Stack

#### Frontend

- **React.js**
- **Context API** for state management
- **Custom Hooks**
- **Tailwind CSS** for styling
- **Axios** for API integration
- **React Form Hook** for form handling
- **YUP** for validation
- **React Icons**, **Emoji Mart**, **React Toastify**, **React Responsive** for enhanced user experience

#### Backend

- **Node.js** with Express.js
- **MongoDB** for data storage
- **Firebase** for authentication and password management
- **Socket.io** for real-time messaging
- **Nodemailer** for email notifications
- **JWT** for secure authentication and authorization

### Custom Functionalities

1. **Socket & Authentication Hooks**: Simplifies and standardizes state management for socket connections and authentication.
2. **Dynamic Chat Updates**: Chats are dynamically updated based on user interactions, message deletions, and new message receipts.
3. **Message Sync**: When a message is deleted by the sender, it is also removed from the receiver’s chat view. If the message is the only one in the chat, the entire chat is deleted.

---

## Knnect Screenshots

![](/Images/SignIn-page.jpg)
![](/Images/google-signin-popup.png)
![](/Images/SignUp-page.jpg)
![](/Images/signup-success-mail.png)
![](/Images/ResetPassword-page.jpg)
![](/Images/resetPassword-sending-mail.png)
![](/Images/usersList.png)
![](/Images/userProfile.png)
![](/Images/chatUser.png)
![](/Images/myprofile-page.png)
![](/Images/changePassword-page.png)
![](/Images/profileDelete.png)
![](/Images/accountDeletion-mail.png)
![](/Images/userChats-page.png)
![](/Images/sidebar.png)
![](/Images/messages.png)

**Knnect** – Seamless and secure real-time communication, built for everyone.

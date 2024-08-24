import Time "mo:base/Time";
import Principal "mo:base/Principal";
import Array "mo:base/Array";
import Debug "mo:base/Debug";

actor ChatRoom {
  type Message = {
    username: Text;
    text: Text;
    timestamp: Time.Time;
  };

  stable var messages: [Message] = [];
  stable var usernames: [(Principal, Text)] = [];

  public shared(msg) func sendMessage(username: Text, text: Text) : async () {
    let timestamp: Time.Time = Time.now();
    let newMessage: Message = { username = username; text = text; timestamp = timestamp };
    messages := Array.append<Message>(messages, [newMessage]);
  };

  public query func getMessages() : async [Message] {
    return Array.sort<Message>(messages, func(a: Message, b: Message) : {#less; #equal; #greater} {
      if (a.timestamp < b.timestamp) #less else if (a.timestamp > b.timestamp) #greater else #equal
    });
  };

  public shared(msg) func setUsername(newUsername: Text) : async Bool {
    let caller: Principal = msg.caller;

    // Check if username already exists
    let usernameExists = Array.find<Text>(
      Array.map<(Principal, Text), Text>(usernames, func(entry) { entry.1 }),
      func(name) { name == newUsername }
    ) != null;
    if (usernameExists) {
      Debug.print("Username already exists: " # newUsername);
      return false;
    } else {
      // Remove any existing username associated with the caller
      usernames := Array.filter(usernames, func(entry: (Principal, Text)) : Bool { entry.0 != caller });
      // Store the new username associated with the caller
      usernames := Array.append(usernames, [(caller, newUsername)]);
      Debug.print("Username stored: " # newUsername);
      return true;
    }
  };

  public query func getUsername(userId: Principal) : async ?Text {
    let result = Array.find<(Principal, Text)>(usernames, func(entry: (Principal, Text)) : Bool { entry.0 == userId });
    Debug.print("getUsername result for " # Principal.toText(userId) # ": " # (switch result {
      case (?entry) entry.1;
      case null "null";
    }));
    return switch result {
      case (?entry) ?entry.1;
      case null null;
    };
  };

  public shared(msg) func whoAmI() : async Principal {
    return msg.caller;
  };

  public query func listUsernames() : async [(Principal, Text)] {
    Debug.print("Listing all usernames and associated Principal IDs");
    return usernames;
  };
  
  public query func listMessages() : async [Message] {
    Debug.print("Listing all messages");
    return messages;
  }
}

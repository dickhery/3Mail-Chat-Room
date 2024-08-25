import Time "mo:base/Time";
import Principal "mo:base/Principal";
import Array "mo:base/Array";
import Debug "mo:base/Debug";
import Text "mo:base/Text";

actor ChatRoom {
    type Message = {
        username: Text;
        text: Text;
        timestamp: Time.Time;
    };

    stable var messages: [Message] = [];
    stable var usernames: [(Principal, Text, Time.Time)] = [];
    let allowedAdmins: [Principal] = [
        Principal.fromText("lhqjs-2526y-iveq4-ehfgj-fqx72-3s4pk-wrr5u-bwdb7-inxiv-vnv32-pqe") // Add your allowed PIDs here
    ];

    public shared(msg) func sendMessage(username: Text, text: Text) : async () {
        let timestamp: Time.Time = Time.now();
        let newMessage: Message = { username = username; text = text; timestamp = timestamp };
        messages := Array.append<Message>(messages, [newMessage]);
    };

    public query func getMessages() : async [Message] {
        return Array.sort<Message>(messages, func(a: Message, b: Message) : {#less; #equal; #greater} {
            if (a.timestamp < b.timestamp) #less
            else if (a.timestamp > b.timestamp) #greater
            else #equal
        });
    };

    public shared(msg) func setUsername(newUsername: Text) : async Bool {
        let caller: Principal = msg.caller;
        let lowerUsername = Text.toLowercase(newUsername);

        // Check if username already exists (case insensitive)
        let usernameExists = Array.find<Text>(
            Array.map<(Principal, Text, Time.Time), Text>(usernames, func(entry) { Text.toLowercase(entry.1) }),
            func(name) { name == lowerUsername }
        ) != null;

        if (usernameExists) {
            Debug.print("Username already exists: " # newUsername);
            return false;
        } else {
            // Check if the user is within the 24-hour cooldown
            let lastChangeTimeOpt = Array.find<(Principal, Text, Time.Time)>(usernames, func(entry: (Principal, Text, Time.Time)) : Bool {
                entry.0 == caller
            });

            switch (lastChangeTimeOpt) {
                case (null) {
                    // No previous username, allow creation
                };
                case (?lastChangeTime) {
                    let timeDifference = Time.now() - lastChangeTime.2;  // Calculate time difference directly
                    if (timeDifference < 86400000000) { // 24 hours in nanoseconds
                        Debug.print("User is in cooldown period: " # newUsername);
                        return false;
                    }
                };
            };

            // Remove any existing username associated with the caller
            usernames := Array.filter(usernames, func(entry: (Principal, Text, Time.Time)) : Bool { entry.0 != caller });
            
            // Store the new username associated with the caller and the current timestamp
            usernames := Array.append(usernames, [(caller, newUsername, Time.now())]);
            Debug.print("Username stored: " # newUsername);
            return true;
        }
    };

    public query func getUsername(userId: Principal) : async ?Text {
        let result = Array.find<(Principal, Text, Time.Time)>(usernames, func(entry: (Principal, Text, Time.Time)) : Bool {
            entry.0 == userId
        });
        Debug.print("getUsername result for " # Principal.toText(userId) # ": " # (switch result { case (?entry) entry.1; case null "null"; }));
        return switch result {
            case (?entry) ?entry.1;
            case null null;
        };
    };

    // Utility function to check if an array contains a specific Principal
    private func arrayContains(arr: [Principal], target: Principal) : Bool {
        return switch (Array.find<Principal>(arr, func(x) { x == target })) {
            case (null) false;
            case (_) true;
        };
    };

    public shared(msg) func deleteMessage(timestamp: Time.Time) : async Bool {
        let caller = msg.caller;

        if (arrayContains(allowedAdmins, caller)) {
            messages := Array.filter<Message>(messages, func(msg) { msg.timestamp != timestamp });
            return true;
        } else {
            return false;
        }
    };

    public query func isAdmin(userId: Principal) : async Bool {
        return arrayContains(allowedAdmins, userId);
    };

    public shared(msg) func whoAmI() : async Principal {
        return msg.caller;
    };

    public query func listUsernames() : async [(Principal, Text, Time.Time)] {
        Debug.print("Listing all usernames and associated Principal IDs");
        return usernames;
    };

    public query func listMessages() : async [Message] {
        Debug.print("Listing all messages");
        return messages;
    };
};

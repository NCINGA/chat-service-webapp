import {gql} from '@apollo/client';

export const CHAT_SUBSCRIPTION = gql`
    subscription Subscription($message: MessageInput) {
        subscription(message: $message) {
            user
            message
            timestamp
            inputType
            session
        }
    }
`;

export const CHAT_SEND_MESSAGE = gql`
    mutation SendMessage($message: MessageInput) {
        sendMessage (message: $message){
            user
            message
            timestamp
            inputType
            session
        }
    }

`;


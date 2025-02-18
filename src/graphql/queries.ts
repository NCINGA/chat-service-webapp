import {gql} from '@apollo/client';

export const CHAT_SUBSCRIPTION = gql`
    subscription Subscription($message: MessageInput) {
        subscription(message: $message) {
            session
            user
            message
            timestamp
            inputType
            args
        }
    }
`;

export const CHAT_SEND_MESSAGE = gql`
    mutation SendMessage($message: MessageInput) {
        sendMessage (message: $message){
            session
            user
            message
            timestamp
            inputType
            args
        }
    }

`;


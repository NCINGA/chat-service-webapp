import {gql} from '@apollo/client';

export const CHAT_SUBSCRIPTION = gql`
    subscription Chat($chat: ChatInput!) {
        chat(chat: $chat) {
            user,
            message
        }
    }
`;

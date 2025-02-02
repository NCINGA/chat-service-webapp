import React, {FC} from 'react'
import './App.css'
import {IConfig} from "./data/Config";
import ChatView from "./ChatView/ChatView";
import {ApolloProvider} from "@apollo/client";
import client from "./graphql/apploClient";

const App: FC<IConfig> = () => {

    return (
        <React.Fragment>
            <ApolloProvider client={client}>
                <ChatView/>
            </ApolloProvider>
        </React.Fragment>

    )
}

export default App

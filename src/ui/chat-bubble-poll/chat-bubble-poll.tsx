import * as styles from "./chat-bubble-poll.css";
import * as React from "react";
import {Component} from "react";
import {ChatBubbleImage, ChatBubbleLink, ChatBubbleProperties} from "../chat-bubble/chat-bubble";
import {Chapter} from "../../interfaces/script";

interface ChatBubblePollProperties {

}

interface ChatBubblePollState {
    pollSent: boolean;

}

export class ChatBubblePoll extends Component<ChatBubblePollProperties, ChatBubblePollState> {
    constructor(props) {
        super(props);
        this.state = {pollSent: false}
    }

    render(){

        return <h1>Yes yes yes tes</h1>
    }

}

import * as styles from "./chat-bubble-poll.css";
import * as React from "react";
import {Component} from "react";
import {ChatBubbleImage, ChatBubbleLink, ChatBubbleProperties} from "../chat-bubble/chat-bubble";
import {Chapter} from "../../interfaces/script";
import {createCounter, db, getCount, incrementCounter} from "../../bridge/database";

interface ChatBubblePollProperties {
    question: string;
    choices: string[];
    followUp?: string;
    pollID: string;

}

interface ChatBubblePollState {
    pollSent: boolean;
    databaseRef: any;
    value: number;
}

export class ChatBubblePoll extends Component<ChatBubblePollProperties, ChatBubblePollState> {
    constructor(props) {
        super(props);
        this.state = {
            pollSent: false,
            databaseRef: undefined, // Todo:fix any
            value: 0
        }
        this.setUpDatabase = this.setUpDatabase.bind(this);
    }

    setUpDatabase() {
        for(var i=0; i<=this.props.choices.length; i++){}
        let ref = db.collection(this.props.pollID).doc(this.props.choices[0]);
        const ergebnis = ref.get()
        ergebnis.then(function (value) {
            console.log(value, "existiert Ckers?");
            if (!value.exists) {

                createCounter(ref, 10)
            }
        })
        this.setState({databaseRef: ref})
    }

    componentDidMount() {
        this.setUpDatabase()
    }


    render() {
        let self = this;

        let retVal;
        if (!this.state.pollSent) {
            retVal = (<div>
                <div>{this.props.question}</div>
                <div className={styles.bubblePollButtonsContainer}>

                    <button className={styles.bubblePollButtons} onClick={() => {
                        incrementCounter(db, this.state.databaseRef, 10);
                        let test = getCount(this.state.databaseRef);

                        test.then(function (value) {
                            self.setState({
                                pollSent: true,
                                value: value,
                            });
                            console.log(value, 'value')
                        })

                    }}>
                        {this.props.choices[0]}
                    </button>
                    <button className={styles.bubblePollButtons} onClick={() => {
                        console.log("ard")
                        incrementCounter(db, this.state.databaseRef, 10);
                        let test = getCount(this.state.databaseRef);

                        test.then(function (value) {
                            self.setState({
                                value: value,
                            });
                            console.log(value, 'value')
                        })
                    }}>
                        {this.props.choices[1]}
                    </button>
                </div>

            </div>)
        } else {
            retVal = (
                <div key="text" className={styles.bubblePollPadding}>
                    {this.props.followUp}
                    {this.props.choices[0]}: {this.state.value}
                    {this.props.choices[1]}: {this.state.value}
                </div>
            )
        }
        return retVal
    }
}

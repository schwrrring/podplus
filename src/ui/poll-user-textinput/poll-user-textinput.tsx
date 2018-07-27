import * as styles from "./poll-user-textinput.css";
import * as React from "react";
import {Component} from "react";
import {ChatBubblePollProperties, ChatBubblePollState} from "../chat-bubble/chat-bubble";
import {createCounter, db, getCount, incrementCounter} from "../../bridge/database";


export class PollUserTextinput extends Component<ChatBubblePollProperties, ChatBubblePollState> {
    constructor(props) {
        super(props);
        this.state = {
            pollSent: false,
            databaseRefs: [],
            value: []
        }
        this.setUpDatabase = this.setUpDatabase.bind(this);
    }

    setUpDatabase() {
        let temp: any[];
        temp = [];
        for (var i = 0; i < this.props.choices.length; i++) {
            let ref = db.collection(this.props.pollID).doc(this.props.choices[i]);
            const ergebnis = ref.get()
            ergebnis.then(function (value) {
                console.log(value, "existiert Ckers?");
                if (!value.exists) {
                    createCounter(ref, 10)
                }
            })
            temp.push(ref)
        }
        this.setState(
            {databaseRefs: temp}
        )

    }

    componentDidMount() {

        // dirty dirty hack to make the textArea available
        document.getElementById(this.props.pollID)!.parentElement!.parentElement!.parentElement!.style.zIndex = "1";

        this.setUpDatabase()
    }


    render() {
        let self = this;

        let retVal;
        if (!this.state.pollSent) {
            ;
            retVal = (
                <div id={this.props.pollID}>

                    <div>{this.props.question}</div>
                    <div className={styles.bubblePollButtonsContainer}>

                    <textarea rows={4} cols={50}>
At w3schools.com you will learn how to make a website. We offer free tutorials in all web development technologies.
</textarea>
                        <div>
                        <button onClick={()=> { this.setState({ pollSent: true} )}}>
                            Abbrechen
                        </button>
                        <button onClick={()=> { this.setState({ pollSent: true} )}}>
                            Senden
                        </button>
                        </div>
                    </div>

                </div>)
        } else {
            retVal = (
                <div key="text" className={styles.bubblePollPadding}>
                    {this.props.followUp}
                </div>
            )
        }
        return retVal
    }
}

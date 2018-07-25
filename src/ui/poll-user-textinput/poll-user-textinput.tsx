import * as styles from "./poll-user-textinput.css";
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
    databaseRefs: any[];
    value: any;
}

export class PollUserTextinput extends Component<ChatBubblePollProperties, ChatBubblePollState> {
    constructor(props) {
        super(props);
        this.state = {
            pollSent: false,
            databaseRefs: [], // Todo:fix any
            value: []
        }
        this.setUpDatabase = this.setUpDatabase.bind(this);
    }

    setUpDatabase() {
        let temp:any[];
        temp = [];
        for(var i=0; i<this.props.choices.length; i++) {
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
                        incrementCounter(db, this.state.databaseRefs[0], 10);
                        let iterable = this.state.databaseRefs.map((val)=>getCount(val) );
                        let results = Promise.all(iterable)
                            .then((valutys) => {
                                this.setState({
                                    pollSent: true,
                                    value: valutys
                                })
                                console.log(valutys, 'na, klappts')
                            })
                    }}>
                        {this.props.choices[0]}
                    </button>
                    <button className={styles.bubblePollButtons} onClick={() => {

                        incrementCounter(db, this.state.databaseRefs[1], 10);
                        let iterable = this.state.databaseRefs.map((val)=>getCount(val) );
                        let results = Promise.all(iterable)
                            .then((valutys) => {
                                this.setState({
                                    pollSent: true,
                                    value: valutys
                                })
                                console.log(valutys, 'na, klappts')
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
                    {this.props.choices[0]}: {this.state.value[0]}
                    {this.props.choices[1]}: {this.state.value[1]}
                </div>
            )
        }
        return retVal
    }
}
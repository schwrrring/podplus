import * as firebase from 'firebase'
import firestore from 'firebase/firebase-firestore'



interface FirebaseConfig{
    apiKey: string,
    authDomain: string,
    databaseURL: string,
    projectId: string,
    storageBucket: string,
    messagingSenderId: string
}

var config: FirebaseConfig  = {
    apiKey: "AIzaSyCSLm03JMbMC1aAajxckMfubHXNIk-gGXc",
    authDomain: "testen-d968c.firebaseapp.com",
    databaseURL: "https://testen-d968c.firebaseio.com",
    projectId: "testen-d968c",
    storageBucket: "testen-d968c.appspot.com",
    messagingSenderId: "444396349659"
};
firebase.initializeApp(config);1

export const db = firebase.firestore();

export function createCounter ( ref: firebase.firestore.DocumentReference, num_shards: number) {
    var batch = db.batch();

    // Initialize the counter document
    batch.set(ref, { num_shards: num_shards });

    // Initialize each shard with count=0
    for (let i = 0; i < num_shards; i++) {
        let shardRef = ref.collection('shards').doc(i.toString());
        batch.set(shardRef, { count: 0 });
    }

    // Commit the write batch
    return batch.commit();
}

export function incrementCounter(db, ref, num_shards) {
    // Select a shard of the counter at random
    const shard_id = Math.floor(Math.random() * num_shards).toString();
    const shard_ref = ref.collection('shards').doc(shard_id);

    // Update count in a transaction
    return db.runTransaction(t => {
        return t.get(shard_ref).then(doc => {
            const new_count = doc.data().count + 1;
            t.update(shard_ref, { count: new_count });
        });
    });
}

export function getCount(ref) {
    // Sum the count of each shard in the subcollection
    return ref.collection('shards').get().then(snapshot => {
        let total_count = 0;
        snapshot.forEach(doc => {
            total_count += doc.data().count;
        });

        return total_count;
    });
}


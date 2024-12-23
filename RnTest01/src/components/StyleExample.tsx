import React from 'react';
import { StyleSheet, View, Text, SafeAreaView } from 'react-native';

const StyleExample = (props) => {
    return (
        <SafeAreaView style={styles.container}>
            {/* <View style={styles.aContainer}>
        <Text style={styles.aText}>Hello World!</Text>
      </View> */}
            <View style={styles.bContainer}></View>
            <View style={styles.cContainer}></View>
        </SafeAreaView>
    )
};

export default StyleExample;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1a1e25',
        flexDirection: 'column',
        // flexDirection: 'row',
        
        // alignItems: 'center',
        // justifyContent: 'center',

    },
    aContainer: {
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',        
        // width: 100,
        // height: 100,
        // padding: 10,
    },
    bContainer: {
        backgroundColor: '#eeb7ff1a',
        flex: 1,

        // width: '100%',
        // height: '50%',
    },
    cContainer: {
        backgroundColor: 'rgba(59,130,246,.5)',
        flex: 2,

        // width: '100%',
        // height: '50%',
    },
    aText: {
        fontSize: 28
    },
})
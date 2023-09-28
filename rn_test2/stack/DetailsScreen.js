import { Text, StyleSheet, View, Button } from 'react-native'
import React, { Component } from 'react'

export default class DetailsScreen extends Component {

    static navigationOptions = {
        title: 'Details',
      };

    render() {
        /* 2. Get the param, provide a fallback value if not available */
        const { navigation } = this.props;
        const itemId = navigation.getParam('itemId', 'NO-ID');
        const otherParam = navigation.getParam('otherParam', 'some default value');

        navigationOptions = {
            title: 'Details',
        };

        return (
            <View style={styles.container}>
                <Text>DetailsScreen</Text>
                <Text>itemId: {JSON.stringify(itemId)}</Text>
                <Text>otherParam: {JSON.stringify(otherParam)}</Text>
                <Button
                    title="Go to Details... again"
                    onPress={() => navigation.navigate('Details', {
                        itemId: Math.floor(Math.random() * 100),
                    })}
                />
                <Button
                    title="Go to Details... again"
                    onPress={() => navigation.push('Details')}
                />
                <Button
                    title="Go back"
                    onPress={() => navigation.goBack()}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#EAE1CE'
      }
})
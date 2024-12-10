import React, { useRef } from 'react';
import { Animated, StyleSheet, View, Text, Button, SafeAreaView } from 'react-native';

const AnimatedExample = () => {
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const fadeIn = () => {
        // Will change fadeAnim value to 1 in 5 seconds
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 5000,
            useNativeDriver: true,
        }).start();
    }

    const fadeOut = () => {
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 5000,
            useNativeDriver: true,
        }).start();
    }




    return (
        <SafeAreaView style={styles.container}>
            <Animated.View style={[styles.fadingContainer, {
                opacity: fadeAnim
            }]}>
                <Text style={styles.fadingText}>Fade in/out</Text>
            </Animated.View>
            <View style={styles.buttonRow}>
                <Button title="Fade in" onPress={fadeIn} />
                <Button title="Fade out" onPress={fadeOut} />
            </View>
        </SafeAreaView>

    )
};

export default AnimatedExample;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    fadingContainer: {
        padding: 20,
        backgroundColor: 'powderblue'
    },
    fadingText: {
        fontSize: 28
    },
    buttonRow: {
        flexBasis: 100,
        justifyContent: 'space-evenly',
        marginVertical: 15,
    },
})
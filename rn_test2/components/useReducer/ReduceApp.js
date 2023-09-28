import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import CountProvider from './CountProvider';
import Count from './Count'

export default function ReduceApp() {

    return (
        <CountProvider>
            <Count />
        </CountProvider>

    )
}


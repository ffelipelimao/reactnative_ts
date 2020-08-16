import React from 'react';
import { View, Button } from 'react-native'

import { useAuth } from '../../hooks/Auth'

const Dashboard: React.FC = () => {
    const { signout } = useAuth()

    return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
            <Button title="sair" onPress={signout} />
        </View>
    )
}


export default Dashboard;
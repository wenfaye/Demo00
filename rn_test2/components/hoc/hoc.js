import { Text, View } from 'react-native'

export function withLoading(WrappedComponent) {
    return class extends WrappedComponent{
        render(h) {
            if(this.props.isLoading){
                return <Text>Loading</Text>
            }else{
                return super.render();
            }
        }
    }
}
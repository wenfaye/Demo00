function withLoading(WrappedComponent) {
    return class extends WrappedComponent{
        render() {
            if(this.props.isLoading){
                return <Loading/>
            }else{
                return super.render();
            }
        }
    }
}
export default (initialState)=>{
    const {userName} = initialState;
    return {
        hasPermision:userName=='merlinhong'
    }
}
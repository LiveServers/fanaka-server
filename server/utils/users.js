export function returnActiveUsers(users,room){
    return users.filter(item=> item.room === room);
}
export function findActiveUser(users,id){
    return users.filter(item=> item.id === id)[0];
}

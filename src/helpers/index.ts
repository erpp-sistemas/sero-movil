export const wihoutDuplicated = (data: any[]) => {

    const arraySinDuplicados = data.filter((valor, indice, self) => {
        return self.indexOf(valor) === indice;
    });

    return arraySinDuplicados
}


export const getFecha = () => {
    var dateDay = new Date().toISOString();
    let date: Date = new Date(dateDay);
    let ionicDate = new Date(
        Date.UTC(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            date.getHours(),
            date.getMinutes(),
            date.getSeconds()
        )
    );
    return ionicDate.toISOString();
}
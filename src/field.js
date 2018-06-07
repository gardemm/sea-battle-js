/**
 * Поле кораблей
 */
class Field {
    constructor (height, width) {
        this.height = height; // высота
        this.width = width; // длина
        this.shipCellsCount = 0; // текущее количество не тронутых палуб

        /**
         * матрица текущих значений поля
         * ________________________________________________________
         * @type {{status: number, id: number}[][]}
         */
        this.matrix = [];

        /**
         * массив кораблей с координатами и значением текущих жизней
         * _________________________________________________________
         * @type {{lives: number, coords[]: {x: number, y: number}}[]}
         */
        this.ships = []; // {lives: int, coords: array({x,y})}

        this.randomShips(height,width);
    }


    /**
     * расставляем корабли рандомно
     * ___________________________
     * @param height
     * @param width
     */
    randomShips (height, width) {

        // matrix[i][j].status
        // 0 - пустая клетка
        // 1 - корабль
        // 2 - промах
        // 3 - ранение
        // 4 - убит

        // новое пустое поле
        for (let i = 0; i < height; i++) {
            this.matrix[i] = [];
            for(let j = 0; j < width; j++) {
                this.matrix[i][j] = { id: null, status: 0 };
            }
        }

        this.addShip(4);

        this.addShip(3);
        this.addShip(3);

        this.addShip(2);
        this.addShip(2);
        this.addShip(2);

        this.addShip(1);
        this.addShip(1);
        this.addShip(1);
        this.addShip(1);
    }


    /**
     * случайные координаты точки начала построения корабля
     * ____________________________________________________
     * @param direction - направление корабля
     * @param dimension - длина корабля
     * @return {{y: number, x: number}}
     */
    getRandomPoints (direction, dimension) {
        return {
            y: parseInt(Math.random()*(this.height - +dimension*+!direction)),
            x: parseInt(Math.random()*(this.width - +dimension*+direction))
        }
    }


    /**
     * Создает на поле случайный корабль заданного размера
     * ____________________________________________________
     * @param dimension
     */
    addShip (dimension) {

        // направление корабля
        // 0 - вертикально
        // 1 - горизонтально
        let direction = parseInt(Math.random() * 2),
            { y, x } = this.getRandomPoints(direction, dimension),
            xx = 0,
            yy = 0,
            i = 0,
            spaceFounded = false // флаг, что свободное место для корабля на поле найдено
        ;

        // переопределение параметров
        let reset = () => {
            direction = parseInt(Math.random() * 2);
            i = 0;
            y = this.getRandomPoints(direction, dimension).y;
            x = this.getRandomPoints(direction, dimension).x;
        }

        // нужно сперва проверить, свободно ли поле, а затем заполнять его кораблем.
        // бесконечный цикл поиска свободного пространства для корабля
        while(!spaceFounded) {
            yy = y + i * +!direction;
            xx = x + i * +direction;

            // горизонтально (слева на право)
            if (direction) {
                // для первой палубы
                if (i === 0) {
                    // если не свободны крайние левые ячейки
                    if (!this.isEmptyCell(yy - 1, xx - 1) ||
                        !this.isEmptyCell(yy, xx - 1) ||
                        !this.isEmptyCell(yy + 1, xx - 1)
                    ) {
                        reset();
                        continue;
                        // переопределяем точки и начинаем заного цикл.
                    }

                    if (!this.isEmptyCell(yy - 1, xx) ||
                        !this.isEmptyCell(yy, xx) ||
                        !this.isEmptyCell(yy + 1, xx)
                    ) {
                        reset();
                        continue;
                    }
                } // i === 0

                // проверяем промежуточные точки и соседние
                if (i > 0) {
                    if (!this.isEmptyCell(yy - 1, xx) ||
                        !this.isEmptyCell(yy, xx) ||
                        !this.isEmptyCell(yy + 1, xx)
                    ) {
                        reset();
                        continue;
                    }
                }

                // проверяем последнюю точку и соседние
                if( i === dimension - 1) {
                    if (!this.isEmptyCell(yy - 1, xx + 1) ||
                        !this.isEmptyCell(yy, xx + 1) ||
                        !this.isEmptyCell(yy + 1, xx + 1)
                    ) {
                        reset();
                        continue;
                        // переопределяем точки и начинаем заного цикл.
                    }
                }

            // вертикально (сверху вниз)
            } else {

                // проверяем первую точку и соседние
                if (i === 0) {
                    if (!this.isEmptyCell(yy-1, xx-1) ||
                        !this.isEmptyCell(yy-1, xx) ||
                        !this.isEmptyCell(yy-1, xx+1)
                    ) {
                        reset();
                        continue;
                    }

                    if (!this.isEmptyCell(yy, xx - 1) ||
                        !this.isEmptyCell(yy, xx) ||
                        !this.isEmptyCell(yy, xx + 1)
                    ) {
                        reset();
                        continue;
                    }
                } // i === 0

                // проверяем промежуточные точки
                if (i > 0) {
                    if (!this.isEmptyCell(yy, xx - 1) ||
                        !this.isEmptyCell(yy, xx) ||
                        !this.isEmptyCell(yy, xx + 1)
                    ) {
                        reset();
                        continue;
                    }
                }

                // проверяем последнюю точку и соседние точки
                if( i === dimension - 1) {
                    if (!this.isEmptyCell(yy + 1, xx - 1) ||
                        !this.isEmptyCell(yy + 1, xx) ||
                        !this.isEmptyCell(yy + 1, xx + 1)
                    ) {
                        reset();
                        continue;
                        // переопределяем точки и начинаем заного цикл.
                    }
                }

            } // вертикально

            // если все проверки пройдены и достигнут конец размерности массива, то выход из цикла
            if (i >= dimension - 1) {
                spaceFounded = true;
            } else {
                i++;
            }
        } // for - нашли вариант для незанятого пространства

        // добавляем новый корабль с кол-вом палуб и порядковым id
        this.ships.push({ lives: dimension, coords: [] });

        // заполняем кораблями поле. Один корабль это последовательность ячеек с номером его id + 10
        for(let i = 0; i < dimension; i++) {

            // заполняем поле
            this.matrix[y + i*+!direction][x + i*+direction] = {
                id: this.ships.length,
                status: 1
            };

            // добавляем в coords массива ships, координаты ячеек для его ячеек
            this.ships[this.ships.length - 1]
                .coords.push({y :y + i*+!direction, x: x + i*+direction})
        } // for

        this.shipCellsCount += dimension;
    } // this.addShip



    /**
     * Ячейка не занята кораблем?
     * __________________________________________
     * @param y
     * @param x
     * @return {boolean}
     */
    isEmptyCell (y, x) {
        // если мы за пределами поля, возвращаем true
        if(y < 0 || x < 0 || y > this.height - 1 || x > this.width - 1) { return true; }
        if(this.matrix[y][x].status === 0) {
            return true;
        } else {
            return false;
        }
    }
};

export default Field;
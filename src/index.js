import './scss/style.scss';
import Field from "./field";
import $ from 'jquery';

const CELL_SIZE_PX = 32;

/**
 * Dom манипуляции морского боя
 */
class SeaBattle {
    /**
     * Размеры поля
     * ___________________________
     * @param height
     * @param width
     */
    constructor (height, width) {
        width = width > 25 ? 25 : width;
        height = height > 25 ? 25 : height;
        this.height = height;
        this.width = width;

        this.fieldElm = $('.field');
        this.content = this.fieldElm.find('.content'); // блок с контентом для поля кораблей
        this.leftSide = this.fieldElm.find('.left-side'); // блок с контентом для цифр слева
        this.topSide = this.fieldElm.find('.top-side'); // блок с контентом для букв сверху
        this.shotsCount = $('.shots-count'); // кол-во выстрелов
        this.remainsCount = $('.remains-count'); // сколько осталось попасть
        this.hitsCount = $('.hits-count'); // кол-во попаданий
        this.shipsCount = $('.ships-count'); // количество живых кораблей
        this.overlay = $('.overlay'); // оверлей о завершении игры

        // уровни
        this.lev1 = $('.level1');
        this.lev2 = $('.level2');
        this.lev3 = $('.level3');
        this.lev4 = $('.level4');
        this.lev5 = $('.level5');

        // закончена ли текущая игра
        this.overlay[0].className = 'overlay';

        // обнуляем таблицу результатов
        this.lev1.removeClass('border1 opacity');
        this.lev2.removeClass('border2 opacity');
        this.lev3.removeClass('border3 opacity');
        this.lev4.removeClass('border4 opacity');
        this.lev5.removeClass('opacity').addClass('border5');

        // начать сначала - кнопка
        this.resetBtn = $('.reset-game-btn');
        this.resetBtn.unbind("click").click(() => {
            resetGame();
        });

        // css
        this.overlay.css({
            width: width*CELL_SIZE_PX + 'px',
            height: height*CELL_SIZE_PX + 'px',
            marginLeft: CELL_SIZE_PX + 'px',
            marginTop: CELL_SIZE_PX + 'px'
        });

        this.overlay.find('.text').css({
            lineHeight: height*CELL_SIZE_PX + 'px'
        });

        this.fieldElm.css({
            width: (width+1)*CELL_SIZE_PX + 'px',
            height: (height+1)*CELL_SIZE_PX + 'px'
        });

        this.content.css({
            width: (width+1)*CELL_SIZE_PX + 'px',
            height: (height+1)*CELL_SIZE_PX + 'px'
        });

        this.topSide.css({
            width: (width+1)*CELL_SIZE_PX + 'px',
            height: CELL_SIZE_PX + 'px'
        });

        this.leftSide.css({
            width: CELL_SIZE_PX + 'px',
            height: height*CELL_SIZE_PX + 'px'
        });
        // --- css

        this.field = new Field(height, width);

        // осталось попасть
        this.remainsCount[0].innerHTML = this.field.shipCellsCount + '';

        // кораблей всего
        this.shipsCount[0].innerHTML = this.field.ships.length + '';

        // количество выстрелов
        this.shotsCount[0].innerHTML = 0;

        // количество попаданий
        this.hitsCount[0].innerHTML = 0;

        this.fillCells();

        this.addParalax();
    }

    /**
     * paralax для background изображения
     * ___________________________________________________
     */
    addParalax () {
        let image = $('.background'),
            xpos = 0,
            ypos = 0
        ;

        $(window).mousemove(function(e) {
            xpos = e.clientX / 290;
            ypos = e.clientY / 150;
            image.css({'transform' : 'translate(' + xpos +'%, ' + ypos + '%)'});
        });
    }


    /**
     * Показывать текущий уровень игрока в зависисимости от попаданий
     * ______________________________
     * @param missCount
     */
    switchLevels (missCount) {
        if(missCount >= 5) {
            this.lev4.addClass('border4');
            this.lev5.addClass('opacity');
        }

        if(missCount >= 15) {
            this.lev3.addClass('border3');
            this.lev4.addClass('opacity');
        }

        if(missCount >= 30) {
            this.lev2.addClass('border2');
            this.lev3.addClass('opacity');
        }

        if(missCount >= 50) {
            this.lev1.addClass('border1');
            this.lev2.addClass('opacity');
        }

        if(missCount > 70) {
            this.lev1.addClass('opacity');
        }
    }

    /**
     * Привязка кораблей и событий к DOM
     * _____________________________
     */
    fillCells () {
        const lang = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

        this.content.empty();
        this.leftSide.empty();
        this.topSide.empty();
        // заполняем ячейки
        for(let i = 0; i < this.height; i++) {

            let topDiv = document.createElement('div');
            topDiv.className = 'cell side no-hover';
            topDiv.innerHTML = lang[i];

            let leftDiv = document.createElement('div');
            leftDiv.className = 'cell side no-hover';
            leftDiv.innerHTML = i + 1 + '';

            this.topSide.append(topDiv);
            this.leftSide.append(leftDiv);

            for(let j = 0; j < this.width; j++) {
                let div = document.createElement('div'),
                    span = document.createElement('span'),
                    that = this,
                    cell = this.field.matrix[i][j], // текущая ячейка
                    ship = this.field.ships[ this.field.matrix[i][j].id - 1 ] // текущий корабль
                ;

                // для красивой анимации через бордеры
                div.appendChild(span);

                // равномерное мигание внешних координат ячейки при наведении
                $(div).hover(() => {
                    // mouseenter
                    let leftSideDiv = this.leftSide.children('.cell:eq(' + i + ')')[0],
                        topSideDiv = this.topSide.children('.cell:eq(' + j + ')')[0]
                    ;

                    void leftSideDiv.offsetWidth; // repaint trigger
                    leftSideDiv.classList.add('active');
                    topSideDiv.classList.add('active');
                }, () => {
                    // mouseleave
                    this.leftSide.children('.cell:eq(' + i + ')').removeClass('active');
                    this.topSide.children('.cell:eq(' + j + ')').removeClass('active');
                });

                // есть корабль
                if (cell.status !== 0) {
                    div.className = 'cell';
                    div.onclick = function () {
                        if (cell.status === 1) {

                            let missCount = ++that.shotsCount[0].innerHTML - +that.hitsCount[0].innerHTML;
                            that.switchLevels(missCount);
                            that.hitsCount[0].innerHTML++;
                            that.remainsCount[0].innerHTML--;

                            // присваиваем ячейке статус 3
                            cell.status = 3;

                            // если корабль потоплен полностью
                            if (--ship.lives === 0) {
                                that.shipsCount[0].innerHTML--;
                                // помечаем все

                                for (let l = 0; l < ship.coords.length; l++) {

                                    // находим и меняем все ячейки корабля в DOM дереве
                                    let destr = that.content.children()
                                        [ship.coords[l].y * that.height + ship.coords[l].x];

                                    // анимационный хук
                                    destr.className = "cell no-hover";
                                    setTimeout(function () {
                                        $(destr).addClass('destroyed');
                                    })
                                }

                                // Корабли кончились? Конец игры!
                                if(+that.shipsCount[0].innerHTML === 0) {
                                    that.overlay.addClass('show')
                                }

                            } else {
                                // ранение
                                this.className = "cell wound no-hover";
                            }
                        }

                    }
                } else {
                    // нет корабля
                    div.className = "cell";
                    div.onclick = function () {
                        if (cell.status !== 2) {

                            // промах
                            this.className = "cell no-hover";

                            let missCount = ++that.shotsCount[0].innerHTML - +that.hitsCount[0].innerHTML;
                            that.switchLevels(missCount);

                            // рисуем промах
                            let miss = document.createElement("div");
                            $(this).append(miss);
                            $(miss).addClass("miss");

                            setTimeout(function () {
                                $(miss).addClass("created");
                            });

                            //
                            cell.status = 2;
                        }
                    }
                }

                this.content.append(div)
            }
        }
    }

    /**
     * отображать счетчик посещаемости
     * ___________________________________
     */
    static liveInternetCounter () {
        let img = "<img src='//counter.yadro.ru/hit?t23.6;r"+
            escape(document.referrer)+((typeof(screen)==="undefined")?"":
                ";s"+screen.width+"*"+screen.height+"*"+(screen.colorDepth?
                screen.colorDepth:screen.pixelDepth))+";u"+escape(document.URL)+
            ";h"+escape(document.title.substring(0,150))+";"+Math.random()+
            "' alt='' title='LiveInternet: показано число посетителей за"+
            " сегодня' "+
            "border='0' width='88' height='15'>";

        $('#liveinternet').append(img);
    }
}

let game = new SeaBattle(10,10);

// add counter
SeaBattle.liveInternetCounter();

/**
 * Начать сначала
 */
function resetGame () {
    game = new SeaBattle(10, 10);
}
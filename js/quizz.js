(function () {
    'use strict';

    // Start libs
    //Init Libs
    new WOW().init();
    const contentScroll = new SimpleBar($('main')[0])

    // Start questions carousel //
    let questionsCarousel = $(".owl-carousel.quizz__carousel");
    questionsCarousel = questionsCarousel.owlCarousel({
        loop: false,
        margin: 30,
        items: 1,
        center: true,
        dots: false,
        nav: false,
        navText: [
            "<i class='owl-nav chevron-left'>", "<i class='owl-nav chevron-right'>"
        ],
        slideBy: "page",
        dragEndSpeed: 700,
        mouseDrag: false,
        touchDrag: false,
        pullDrage: false,
        freeDrag: false,
        smartSpeed: 60000,
        animateOut: 'zoomOut',
        animateIn: 'zoomIn',
        startPosition: 0,
    });

    window.dispatchEvent(new Event('resize'));

    ////**  Create Global State **////
    const quizz = {
        user: {
            name: {
                value: '',
                isValid: false
            },

            email: {
                value: '',
                isValid: false
            },
            isValid: false,
        },

        inputs: {
            name: $('#inputLoginNome'),
            email: $('#inputLoginEmail')
        },

        btnLogin: $('#btnSendLogin'),

        btnNextQuestion: $('#btnNextQuestion'),

        quizzRef: $('#quizzControl'),

        boxResposta: $('#boxResposta'),

        btnRestart: $('#btnRestartQuizz'),

        progressBar: $('#progressBar')
    };

    ////**  Set First state values **////
    const resetState = () => {
        quizz.global = {
            totalAcertos: 0,
            totalErros: 0,
            totalPerguntas: quizz.quizzRef.attr('data-totalPerguntas')
        };

        quizz.currentState = {
            id: 0,
            checked: false
        };

        updateProgressBar();
        setHtmlValue('totalPerguntas', quizz.global.totalPerguntas);
        setHtmlValue('perguntaAtual', quizz.currentState.id);
        $('main').find('.animated').addClass('animated-off');
        $('main').find('.animated').removeClass('animated');
        $('main').find('.animated-off').addClass('animated');
    }

    ////**  Create Functions API **////

    const startPage = () => {
        showSection('login');
    }

    // Login Ctrl
    const sendLogin = () => {
        if (quizz.user.isValid) {
            setHtmlValue('nome', quizz.user.name.value);
            startQuizz();
        } else {
            showLoginFormErrors();
        }
    }

    // Start e Finish
    const startQuizz = () => {
        resetState();
        questionsCarousel.trigger('to.owl.carousel', quizz.currentState.id);
        showSection('quizz');
    }

    // Login form functions
    const loginFormHandler = (key, input) => {
        quizz.user[key].value = $(input).val();
        validateForm();
    }

    const selectAnswer = (selected) => {
        if (!quizz.currentState.checked) {
            $('.quizz__questions__item__options__item').attr('data-selected', false);
            selected.attr('data-selected', true);

            const isCorrect = selected.data('correta');

            if (isCorrect) {
                quizz.global.totalAcertos++;
            } else {
                quizz.global.totalErros++;
            }

            quizz.boxResposta
                .find('.quizz__questions__item__resposta__icon img')
                .attr('src', isCorrect ? '../images/ico/acerto.png' : '../images/ico/erro.png');

            quizz.boxResposta
                .find('.quizz__questions__item__resposta__caption__title')
                .text(isCorrect ? 'Você acertou' : 'Você errou');

            quizz.boxResposta
                .find('.quizz__questions__item__resposta__caption__justificativa')
                .text(selected.data('justificativa'));

            quizz.boxResposta.addClass('show');

            setTimeout(() => {
                contentScroll.getScrollElement().scrollTo(0, 500);
            }, 200);
            quizz.btnNextQuestion.attr('disabled', false);
            quizz.currentState.checked = true;
        }
    }

    const finishQuizz = () => {
        setHtmlValue('totalAcertos', quizz.global.totalAcertos);
        setTimeout(() => {
            showSection('result');
        }, 1000);
        fetchProgressData();
    }

    const restartQuizz = () => {
        resetState();
        startQuizz();
    }

    const nextQuestion = () => {
        quizz.boxResposta.removeClass('show');
        quizz.btnNextQuestion.attr('disabled', true);

        if (quizz.currentState.checked) {
            quizz.currentState.id++;
            setHtmlValue('perguntaAtual', quizz.currentState.id);
            updateProgressBar();

            if (quizz.currentState.id < quizz.global.totalPerguntas) {
                quizz.currentState.checked = false;
                contentScroll.getScrollElement().scrollTo(0, 0);
                questionsCarousel.trigger('to.owl.carousel', quizz.currentState.id);
            } else {
                finishQuizz();
            }
        }

        //realiza as animacoes etc
    }

    // Util
    const fetchProgressData = () => {
        $.post("url.php", {
                nome: quizz.user.name.value,
                email: quizz.user.email.value,
            })
            .done(function (data) {
                console.log('Finish finalizado: ', data)
            });
    }

    const updateProgressBar = () => {
        quizz.progressBar.width(parseInt((quizz.currentState.id / quizz.global.totalPerguntas) * 10) + '0%');
    }

    const setHtmlValue = (key, value) => {
        $('.get--' + key).text(value);
    }

    const showSection = (key) => {
        $('.quizz-section').removeClass('show');
        $('#' + key).addClass('show');
    }

    const showLoginFormErrors = () => {
        $('#loginErrorBox').fadeIn();

        if (!quizz.user.name.isValid) {
            $('#loginErrorName').fadeIn();

        } else {
            $('#loginErrorName').hide();
        }

        if (!quizz.user.email.isValid) {
            $('#loginErrorEmail').fadeIn();
        } else {
            $('#loginErrorEmail').hide();
        }
    }

    const getCurrentState = () => {
        return quizz.currentState.id;
    }

    const getAcertos = () => {
        return quizz.totalAcertos;
    }

    const getErros = () => {
        return quizz.totalErros;
    }

    const validateForm = () => {
        const emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (quizz.inputs.name.val().length > 8) {
            quizz.inputs.name.removeClass('has-error');
            quizz.user.name.isValid = true;
        } else {
            quizz.inputs.name.addClass('has-error');
            quizz.user.name.isValid = false;
        }

        if (emailRegex.test(quizz.inputs.email.val())) {
            quizz.inputs.email.removeClass('has-error');
            quizz.user.email.isValid = true;

        } else {
            quizz.inputs.email.addClass('has-error');
            quizz.user.email.isValid = false;
        }

        if (quizz.user.email.isValid && quizz.user.name.isValid) {
            quizz.user.isValid = true;
        } else {
            quizz.user.isValid = false
        }
    }

    ////** RUN DEFAULT FUNCTIONS **////
    resetState();
    startPage();

    ////**  SET LISTENERS **////
    quizz.inputs.name.keyup(function () {
        loginFormHandler('name', this)
    });

    quizz.inputs.email.keyup(function () {
        loginFormHandler('email', this)
    });

    quizz.btnLogin.click(function () {
        sendLogin();
    });

    quizz.btnNextQuestion.click(function () {
        nextQuestion();
    });

    quizz.btnRestart.click(function () {
        restartQuizz();
    });

    $('.quizz__questions__item__options__item').click(function () {
        selectAnswer($(this));
    });

})();

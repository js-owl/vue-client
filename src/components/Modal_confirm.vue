<template>
  <a @click="showModal">
    обработку персональных данных
  </a>

  <!-- If the option changed modal component the name
  <MyModal>
  -->
  <Modal v-model="isShow" :close="closeModal">
    <div class="modal">
      <div class="uaz-card">
        <section class="uaz-wrapper uaz-processing">
          <div class="uaz-card-registration">
            <label>Политика в области обработки персональных данных</label>
            <span @click="closeModal" class="uaz-modal-close">x</span>
          </div>
          <!--uaz_parts_right_block_content_contianer ??нужно не нужно??-->
          <div class="uaz-modal-body uaz-support-form uaz-card-indent">
            <div class="uaz-col-sm-12 uaz-indent-card">
              <p>
                ПОЛИТИКА ООО «УАЗ» (далее Общество) в области обработки
                персональных данных.
              </p>
              <p style="text-align: center;"><br />ОСНОВНЫЕ ПОЛОЖЕНИЯ</p>
              <p>
                Общество считает важнейшей задачей обеспечение законности и
                справедливости обработки персональных данных, соблюдение их
                конфиденциальности и безопасности процессов их обработки.
                Настоящая Политика в области обработки персональных данных:
              </p>
              <p>
                - разработана в целях обеспечения реализации требований
                законодательства РФ в области обработки персональных данных
                субъектов персональных данных;
              </p>
              <p>
                - является общедоступным документом, декларирующим
                концептуальные основы деятельности Общества при обработке
                персональных данных;
              </p>
              <p>
                - Политика является основой для разработки локальных нормативных
                актов, определяющих политику обработки персональных данных в
                Обществе.
              </p>
              <p style="text-align: center;">КОНЦЕПТУАЛЬНЫЕ ОСНОВЫ</p>
              <p>
                1.1 Персональные данные субъекта представляются им самим.
                Общество вправе получать персональные данные от третьих лиц
                только при наличии письменного согласия субъекта.
              </p>
              <p>
                1.2 Субъект обязан предоставлять достоверные сведения о себе.
                При изменении персональных данных субъект должен письменно
                уведомить об этом Общество в срок, не превышающий 14 календарных
                дней.
              </p>
              <p>
                1.3 Общество не имеет права получать и обрабатывать персональные
                данные субъекта о его политических, религиозных и иных
                убеждениях и частной жизни. В случаях, непосредственно связанных
                с вопросами трудовых отношений, в соответствии со статьей 24
                Конституции РФ Общество вправе получать и обрабатывать данные о
                частной жизни работника только с его согласия.
              </p>
              <p>
                1.4 Обработка персональных данных субъекта Обществом возможна
                только с его согласия либо без его согласия в следующих
                случаях:<br />
                - персональные данные являются общедоступными;<br />
                - персональные данные относятся к состоянию здоровья работника,
                и их обработка необходима для защиты его жизни, здоровья или
                иных жизненно важных интересов других лиц и получение согласия
                работника невозможно;<br />
                - по требованию полномочных государственных органов - в случаях,
                предусмотренных федеральным законом.
              </p>
              <p>
                1.5 При обработке персональных данных, не связанных с
                исполнением трудового договора, Общество обязано получить
                согласие субъекта на обработку его персональных данных.
              </p>
              <p>
                1.6 Обработка персональных данных осуществляется исключительно в
                целях обеспечения соблюдения законов или других правовых актов,
                содействия в трудоустройстве, обучении и продвижении по службе,
                обеспечении личной безопасности, контроля количества и качества
                выполняемой работы и обеспечения сохранности имущества.
              </p>
              <p>
                1.7 При принятии решений, затрагивающих интересы субъекта,
                Общество не имеет права основываться на персональных данных
                работника, полученных исключительно в результате их
                автоматизированной обработки или по электронной почте.
              </p>
              <p>
                1.8 Защита персональных данных от их неправомерного
                использования или утраты обеспечивается Обществом за счет
                собственных средств и в порядке, установленном законодательством
                России.
              </p>
              <p>
                1.9 Передача данных по открытым каналам связи на сайт (с сайта)
                в сети Интернет не гарантирует их конфиденциальность.
              </p>
              <p>Права субъекта персональных данных:</p>
              <p>
                2.1 Получать доступ к своим персональным данным и ознакомление с
                ними.
              </p>
              <p>
                2.2 Требовать от Общества уточнения, исключения или исправления
                неполных, неверных, устаревших, недостоверных, незаконно
                полученных или не являющихся необходимыми для работодателя
                персональных данных.<br />
                Меры по защите персональных данных.
              </p>
              <p>
                3.1 Доступ к персональным данным предоставляется только
                специально уполномоченным на это работникам.
              </p>
              <p>
                3.2 Специально уполномоченные работники, имеющие доступ к
                персональным данным, проводят обработку персональных данных и
                имеют доступ только к тем данным, которые необходимы им для
                выполнения трудовых обязанностей или конкретных функций.
              </p>
              <p>
                3.3 Защита сведений, обрабатывающихся и хранящихся в
                информационных системах персональных данных, от неправомерного
                или случайного доступа, уничтожения, изменения, блокирования,
                копирования, предоставления, распространения, а также от иных
                неправомерных действий в отношении персональных данных
                обеспечивается разграничением прав доступа с использованием
                учетной записи и системой паролей.
              </p>
              <p>
                3.4 Помещения, в которых хранятся персональные данные,
                оборудуются надежными замками и системой сигнализации.
              </p>
              <p>
                3.5 Документы, содержащие персональные данные, подлежат хранению
                и уничтожению в порядке, предусмотренном архивным
                законодательством России.
              </p>
              <p>
                3.6 Персональные данные подлежат уничтожению по достижении целей
                обработки или в случае утраты необходимости в достижении таких
                целей.
              </p>
              <p>
                3.7 Общество проводит мероприятия по проверке порядка обработки
                персональных данных о выполнении мероприятий по
                конфиденциальности.
              </p>
            </div>
          </div>
          <div class="uaz-card-button">
            <button @click="closeModal" class="uaz-card-submit uaz-card-close">
              {{ $t('close').toUpperCase() }}
            </button>
          </div>
        </section>
      </div>
    </div>
  </Modal>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { errorMixin } from '@/plugins/error.plugin'
export default defineComponent({
  setup() {
    const isShow = ref(false)

    function showModal() {
      isShow.value = true
    }

    function closeModal() {
      isShow.value = false
    }

    return {
      isShow,
      showModal,
      closeModal
    }
  }
})
</script>

<style scoped>
body {
  font-family: Arial, Helvetica, sans-serif;
}
.modal {
  width: 600px;
  box-sizing: border-box;
  background-color: #fff;
  font-size: 20px;
  text-align: center;
}
.uaz-header {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  height: 25px;
  width: 100%;
  background-color: #013e2c;
}
.uaz-header-language {
  /*float: right;
  width: 90px;*/
  padding: 5px 0;
  margin: 0 15px 0 25px;

  display: inline-block;
  margin-right: 15px;
  width: auto;
  margin-left: 25px;
}
.uaz-language {
  display: inline-block;
  width: auto;
  color: #fff;
  font-size: 12px;
  text-decoration: none;
  font-family: Arial, sans-serif;
  font-weight: normal;
}
.uaz-language:hover {
  color: #cfdbd9;
}
.uaz-language.active {
  text-decoration: underline !important;
}

.uaz-login-content .uaz-info {
  color: #fff;
}
.uaz-login-content .uaz-info .h1 {
  text-transform: uppercase;
  font-size: 35px;
  font-weight: 600;
}
.uaz-login-content .uaz-info .p {
  font-size: 13px;
  line-height: 1.6;
  font-weight: normal;
}
.uaz-login-content a {
  text-decoration: inherit;
  color: inherit;
}
.uaz-login-content a:hover {
  text-decoration: inherit;
}
.uaz-login-content {
  font-family: Arial, sans-serif;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 900px;
  background: url(../assets/login-bg.jpg) no-repeat top;
  background-size: 1855px 370px;
  margin-top: 125px;
}
.uaz-login-content .uaz-container {
  display: block;
  position: relative;
  width: 530px;
  height: 679px;
  margin: auto;
  right: 310px;
}
.uaz-indent {
  position: absolute;
  top: 0px;
  padding: 35px;
}
.uaz-green {
  position: relative;
  width: 320px;
  height: 370px;
  padding: 35px;
  background-color: #004735;
  opacity: 0.4;
}
.uaz-login-content .uaz-connection {
  position: absolute;
  transition: all 0.7s;
  margin-top: 15px;
}
.uaz-login-content .uaz-connection span {
  font-size: 10px;
  margin-bottom: 0;
  text-align: center;
  color: #fff;
}
.uaz-login-content .uaz-connection span:hover {
  opacity: 0.8;
  transition: all 0.1s ease-in;
}
.uaz-login-content label {
  display: block;
  margin: 7px 0 1px;
  padding: 3px 0px 9px;
  font-size: 10px;
  font-weight: 600;
}
.uaz-login-content .uaz-connection label {
  color: #fff;
}
.uaz-login-content .uaz-forgot {
  display: block;
  font-family: Arial, sans-serif;
  font-size: 10px;
  cursor: pointer;
  margin-top: 5px;
  color: #fff;
}
.uaz-login-content .uaz-forgot:hover,
.uaz-login-content .uaz-registration a:hover {
  text-decoration: underline;
}
.uaz-login-content .uaz-connection input {
  color: #fff;
  background-color: transparent;
  border: 1px solid #fff;
  font-weight: 100;
  font-size: 16px;
  padding: 2px 10px;
  height: 25px;
  width: 100%;
}
.uaz-login-content .uaz-form {
  margin-top: 11px;
}
.uaz-login-content .uaz-enregistrer input {
  display: block;
  width: 100%;
  height: 25px;
  padding: 0 12px;
  font-size: 10px;
  line-height: 1.42857143;
  color: #555;
  background-color: #fff;
  background-image: none;
  border: 1px solid #b8bdc0;
  border-radius: 3px;
}
.uaz-login-content input p {
  color: #fff;
  opacity: 1;
}
.uaz-login-content input.submit {
  height: 30px;
  padding-left: 14px;
  padding-right: 14px;
  cursor: pointer;
  border: none;
  border-radius: 3px;
  min-width: 135px;
  height: 20px;
  color: #fff;
  background-color: #013e2c;
  font-weight: 700;
  font-size: 10px;
}

.uaz-login-content .uaz-enregistrer {
  position: absolute;
  padding: 15% 13%;
  width: 74%;
  right: 0px;
  transition: all 0.7s;
  margin-top: 10px;
}
.uaz-login-content .active-section {
  border: 1px solid black;
}
.uaz-login-content .remove-section {
  margin-top: 400px;
  border: 1px solid black;
}

.uaz-registration {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  padding: 0 0 0 6px;
  margin-top: 3px;
}
.uaz-registration a,
.uaz-registration button {
  cursor: pointer !important;
  color: #fff;
  width: 97px;
}
.uaz-registration a {
  border-color: transparent;
  font-size: 13px;
  padding: 5px 60px 5px 0px;
  font-weight: normal;
}
.uaz-registration button {
  background-color: transparent;
  border: 1px solid #fff;
  padding: 5px 30px;
  margin-top: 3px;
  float: right;
}

.uaz-card {
  text-align: left;
}
.uaz-wrapper {
  background: white;
  box-shadow: 0 0 10px #000;
  position: relative;
  border-radius: 3px;
  display: block;
  padding: 67px 0px;
  width: 650px;
  font-size: 12px;
  line-height: 25px;
  font-weight: 500;
  font-family: Arial, sans-serif;
}
.uaz-wrapper .uaz-check {
  padding: 10px 0;
  margin-bottom: 5px;
}
.uaz-wrapper .uaz-form-checkbox {
  height: 30px;
  margin: 8px 0 2px;
}
.uaz-wrapper .uaz-card-checkbox {
  position: absolute;
  z-index: -1;
  opacity: 0;
  margin: 10px 0 0 20px;
}
.uaz-wrapper .uaz-card-checkbox + label {
  position: relative;
  padding: 0 0 0 60px;
  cursor: pointer;
  font-size: 10px;
}
.uaz-wrapper .uaz-card-checkbox + label:before {
  content: '';
  position: absolute;
  top: -7px;
  left: 0;
  width: 50px;
  height: 26px;
  border-radius: 13px;
  background: #cdd1da;
  box-shadow: inset 0 2px 3px rgb(0 0 0 / 20%);
  transition: 0.2s;
}
.uaz-wrapper .uaz-form-checkbox a {
  text-decoration: underline;
}
.uaz-wrapper .uaz-pointer {
  cursor: pointer;
}
.uaz-wrapper .uaz-card-checkbox + label:after {
  content: '';
  position: absolute;
  top: -5px;
  left: 2px;
  width: 22px;
  height: 22px;
  border-radius: 10px;
  background: #fff;
  box-shadow: 0 2px 5px rgb(0 0 0 / 30%);
  transition: 0.2s;
}
.uaz-wrapper .uaz-check {
  padding: 10px 0 60px;
}
.uaz-wrapper .uaz-form-checkbox a {
  cursor: pointer;
  text-decoration: underline;
}
.uaz-wrapper .uaz-form-checkbox a:hover {
  text-decoration: none;
}

@media screen and (min-width: 530px) {
  .uaz-card {
    width: 75%;
  }
}
@media screen and (min-width: 600px) {
  .uaz-card {
    max-width: 400px;
    width: 65%;
  }
}
@media screen and (max-width: 599px) {
  .uaz-card.in-flight {
    border-radius: 0;
    max-width: 100%;
    top: 0 !important;
    left: 0 !important;
  }
}
@media screen and (min-width: 600px) {
  .uaz-card.in-flight {
    left: calc((100vw - 460px) / 2) !important;
    max-width: 460px !important;
  }
}
@media screen and (min-width: 730px) {
  .uaz-card {
    max-width: 400px;
    width: 40%;
  }
  .uaz-card.in-flight {
    left: calc((100vw - 700px) / 2) !important;
    max-width: 700px !important;
  }
}
@media screen and (min-width: 1000px) {
  .uaz-card {
    width: 400px;
  }
  .uaz-card.xl {
    width: 600px;
    max-width: 600px;
  }
  .uaz-card.xl.active {
    width: 100%;
    max-width: 700px;
  }
}
.uaz-card-registration {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 25px;
  background-color: #013e2c;
  color: #fff;
  padding: 0 5px;
  line-height: 23px;
  text-align: center;
}
.uaz-card-registration {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 25px;
  background-color: #013e2c;
  color: #fff;
  padding: 0 5px;
  line-height: 23px;
  text-align: center;
}
.uaz-card-registration label {
  font-weight: 600;
  text-transform: uppercase;
  font-size: 10px;
}
.uaz-modal-close {
  font-size: 20px;
  position: absolute;
  right: 10px;
  top: 50%;
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
  cursor: pointer;
}

.uaz-modal-close:hover {
  color: #cfdbd9;
}
.uaz-card-indent label {
  display: inline-block;
  width: 153px;
  padding: 5px 0;
}
.uaz-card-indent .uaz__text-danger {
  color: #a94442;
}
.uaz-card-indent input {
  width: 429px;
  height: 25px;
  padding: 0 12px;
  font-size: 10px;
  line-height: 1.42857143;
  color: #555;
  background-color: #fff;
  background-image: none;
  border: 1px solid #b8bdc0;
  border-radius: 3px;
}
.uaz-card-indent input:focus {
  border-color: #013e2c;
  outline: 0;
  box-shadow: inset 0 1px 1px rgb(0 0 0 / 8%), 0 0 8px #cfdbd9;
}
.uaz-indent-card {
  padding-left: 24px;
}
.uaz-card-button {
  padding-right: 14px;
  border-top: 1px solid #eee;
}
.uaz-card-submit {
  cursor: pointer;
  border: none;
  border-radius: 3px;
  min-width: 135px;
  color: #fff;
  background-color: #013e2c;
  font: 400 13.3333px Arial;
  font-size: 10px;
  height: 30px;
  padding: 0 14px;
  float: right;
  margin: 10px;
}

.uaz-processing {
  width: 683px;
}
.uaz-processing .uaz-card-button {
  padding: 10px 14px;
}
.uaz-support-form {
  padding: 50px 20px;
}
.uaz-modal-body {
  height: 680px;
  padding: 10px 24px 1px 0;
  overflow: auto;
}
@media (min-width: 768px) {
  .uaz-col-sm-12 {
    width: 100%;
    float: left;
  }
}
.uaz__col-sm-12 {
  position: relative;
  min-height: 1px;
  padding-right: 5px;
  padding-left: 5px;
}
.uaz-col-sm-12 p {
  text-align: left;
  font-size: 10px;
  font-weight: 600;
  line-height: normal;
}
.uaz-card-close {
  height: 20px;
}

.uaz-recovery {
  padding: 35px 0 50px;
}
.uaz-recovery .uaz-card-indent {
  padding: 0 0 110px 24px;
}
.uaz-modal-form h2 {
  font-size: 2em;
}
.uaz-support-description {
  font-size: 12px;
  font-weight: 400;
  margin: 10px 0;
}
</style>

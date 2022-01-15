import * as yup from "yup";
import { computed } from "vue";

const addAttr = function (name, value) {
  this.input.field.fieldAttrs = {
    ...this.input.field.fieldAttrs,
    ...{ [name]: value },
  };
  return this;
};

const setAttr = function (attrs, name, value) {
  return {
    ...attrs,
    ...{
      [name]: value,
    },
  };
};

const setLabel = function (text = "") {
  this.input.field.fieldAttrs = this.attr(
    this.input.field.fieldAttrs,
    "label",
    text
  );
  return this;
};

// const setRules = function (array) {
//   let rules = array.join("|");
//   this.input.field.fieldAttrs = this.attr(
//     this.input.field.fieldAttrs,
//     "rules",
//     rules
//   );
//   return this;
// };

const addRules = function (fn) {
  this.input.field.rules = fn(this.input.field.rules);
  return this;
};

const setRules = function (rules) {
  this.input.field.rules = rules;
  return this;
};

const setMapOption = function (fn) {
  this.input.field.fieldAttrs = this.attr(
    this.input.field.fieldAttrs,
    "optionMap",
    fn
  );
  return this;
};

const setOptions = function (options) {
  this.input.field.fieldAttrs = this.attr(
    this.input.field.fieldAttrs,
    "options",
    options
  );
  return this;
};

const addOptions = function (options) {
  this.input.field.fieldAttrs = this.attr(
    this.input.field.fieldAttrs,
    "options",
    this.input.field.fieldAttrs.options.concat(options)
  );
  return this;
};

// const addRule = function (chain, args) {
//   return this;
// };

const setMultiple = function (value) {
  this.input.dataType = value ? [] : null;
  this.input.field.fieldAttrs = this.attr(
    this.input.field.fieldAttrs,
    "multiple",
    value
  );
  this.field.rules = yup.mixed();
  return this;
};

const buttonToggle = function (options = []) {
  let usedOptions = !this.input.field.fieldAttrs.options
    ? options
    : this.input.field.fieldAttrs.options;
  this.input.field.fieldAttrs.options = usedOptions;
  this.input.field.component = "selection";
  this.input.field.type = "buttonToggle";
  this.field.rules = yup.string();
  return this;
};

const yesNo = function () {
  this.input.field.component = "selection";
  this.input.field.type = "yesNo";
  this.field.rules = yup.boolean();
  return this;
};

const custom = function (component) {
  this.input.field.component = "field";
  this.input.field.type = "custom";
  this.input.field.template = component;
  return this;
};

const date = function () {
  this.input.field.component = "field";
  this.input.field.type = "date";
  this.field.rules = yup.date();
  return this;
};

const checkbox = function () {
  this.input.field.component = "selection";
  this.input.field.type = "checkbox";
  this.field.rules = yup.mixed();
  return this;
};

const checkboxes = function () {
  this.input.field.component = "q-option-group";
  this.input.field.type = "checkbox";
  this.field.rules = yup.mixed();
  return this;
};

const currency = function () {
  this.input.field.component = "field";
  this.input.field.type = "money";
  this.field.rules = yup.number();
  return this;
};

const setType = function (type) {
  this.input.field.type = type;
  return this;
};

const dropdown = function (options = []) {
  let usedOptions = !this.input.field.fieldAttrs.options
    ? options
    : this.input.field.fieldAttrs.options;
  this.input.field.component = "selection";
  this.input.field.type = "dropdown";
  this.input.field.fieldAttrs.options = usedOptions;
  this.input.field.fieldAttrs = {
    ...this.input.field.fieldAttrs,
    ...{
      options: usedOptions,
      stackLabel: true,
      emitValue: true,
    },
  };
  return this;
};

const email = function () {
  this.input.field.component = "field";
  this.input.field.type = "text";

  this.field.rules = yup.string();

  return this;
};

const number = function () {
  this.input.field.component = "field";
  this.input.field.type = "number";
  this.field.rules = yup.mixed();
  return this;
};

const radioGroup = function (options = []) {
  let usedOptions = !this.input.field.fieldAttrs.options
    ? options
    : this.input.field.fieldAttrs.options;
  this.input.field.component = "selection";
  this.input.field.type = "radioGroup";
  this.field.rules = yup.mixed();
  this.input.field.options = usedOptions;
  return this;
};

const resourceSelect = function (model) {
  // let store = useStore();
  this.input.field.component = "selection";
  this.input.field.fieldAttrs.model = model;
  // this.input.field.fieldAttrs.resource = name;
  this.input.field.type = "resourceSelect";
  this.field.rules = yup.mixed();

  // this.input.field.options = computed(() => query());
  return this;
};

const select = function (options = []) {
  let usedOptions = !this.input.field.fieldAttrs.options
    ? options
    : this.input.field.fieldAttrs.options;
  this.input.field.component = "selection";
  this.input.field.fieldAttrs = {
    ...this.input.field.fieldAttrs,
    ...{
      options: usedOptions,
      stackLabel: true,
      emitValue: true,
    },
  };
  this.field.rules = yup.mixed();
  return this;
};

const text = function () {
  this.input.field.component = "field";
  this.input.field.type = "text";
  this.field.rules = yup.string();
  return this;
};

const textArea = function () {
  this.input.field.component = "field";
  this.input.field.type = "textarea";
  this.field.rules = yup.string();
  this.input.field.fieldAttrs = {
    ...this.input.field.fieldAttrs,
    ...{
      autogrow: true,
    },
  };
  return this;
};

const time = function () {
  this.input.component = "field";
  this.input.type = "time";
  this.field.rules = yup.string();
  // this.input.rules = ["date_format:YYYY-MM-DD"];
  this.field.rules = yup.string();
  return this;
};

const setName = function (name) {
  this.name = name;
  this.input.field.name = name;
  this.input.field.field.name = name;
};

export const setField = (name) => {
  let field = {
    input: {
      name: name,
      dataType: null,
      field: {
        name: name,
        component: null,
        rules: yup.mixed(),
        fieldAttrs: {
          stackLabel: true,
        },
      },
    },
    addOptions: addOptions,
    attr: setAttr,
    addAttr: addAttr,
    addRules,
    buttonToggle: buttonToggle,
    checkbox: checkbox,
    checkboxes: checkboxes,
    currency: currency,
    custom: custom,
    date: date,
    dropdown: dropdown,
    email: email,
    errors: [],
    field: setField,
    label: setLabel,
    mapOption: setMapOption,
    multiple: setMultiple,
    name: name,
    number: number,
    options: setOptions,
    radioGroup: radioGroup,
    resourceSelect: resourceSelect,
    select: select,
    setName: setName,
    setRules,
    setType: setType,
    text: text,
    textArea: textArea,
    time: time,
    yesNo: yesNo,
    visible: function (fn) {
      this.input.field.fieldAttrs = {
        ...this.input.field.fieldAttrs,
        ...{
          visible: fn,
        },
      };
      return this;
    },
  };

  // let create = () => {
  //   return { ...field };
  // };
  return field;
};

import { computed } from "vue";

export const setupFields =
  (...fields) =>
  (usedFields = []) => {
    let filteredFields =
      usedFields.length === 0
        ? fields
        : fields.filter((x) => usedFields.find((y) => x.name === y));

    // const filteredKeys = usedFields.length === 0 ? defaultKeys : foundKeys;

    // this might need to be computed

    const baseFields = filteredFields.reduce((group, field) => {
      return {
        ...group,
        ...{
          [field.name]: field,
        },
      };
    }, {});

    const inputs = computed(() => {
      return Object.keys(baseFields).reduce((total, key) => {
        // checkField(key, baseFields[key].input.field);
        return {
          ...total,
          ...{
            [key]: baseFields[key].input.field,
          },
        };
      }, {});
    });

    const reducedFields = Object.keys(baseFields).reduce((total, key) => {
      // checkField(key, baseFields[key].input.field);
      return {
        ...total,
        ...{
          [key]: baseFields[key].input.field,
        },
      };
    }, {});

    const noLabels = () => {
      Object.values(baseFields).forEach((x) => {
        x.label();
      });
    };

    return {
      schema: Object.keys(baseFields).reduce(
        (schema, key) => ({
          ...schema,
          [key]: baseFields[key].input.field.rules,
        }),
        {}
      ),
      inputs,
      fields: reducedFields,
      configure: baseFields,
      noLabels,
    };
  };

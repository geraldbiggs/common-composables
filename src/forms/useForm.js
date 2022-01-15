import { ref, watch, computed } from "vue";
// import * as yup from "yup";

export const useForm =
  ({ models: entities, bindings = [] }) =>
  ({
    autostart = false,
    configure = {},
    handlers = null,
    statusHandler = null,
    userId = null,
  }) => {
    let status = ref(null);
    let resources = Object.keys(entities);

    let formData = ref(
      resources.reduce(
        (acc, entityKey) => ({
          ...acc,
          [entityKey]: {
            ...new entities[entityKey](
              (configure[entityKey] && configure[entityKey].initialData) || {}
            ),
          },
        }),
        {}
      )
    );

    let models = Object.entries(entities).reduce((models, [key, entity]) => {
      const currentIndex = ref(0);
      const entry = ref({});
      const entries = ref([]);
      const errors = ref({});
      const initialData = ref({});
      const status = ref(null);

      const isActive = computed(
        () => status.value === "new" || status.value === "editing"
      );

      let actions =
        configure[key] && configure[key].isArray
          ? {
              clear: () => {
                formData.value[key] = {};
                currentIndex.value = null;
                status.value = null;
              },
              edit: (entry) => {
                formData.value[key] = { ...entry };
                status.value = "editing";
              },
              save: () => {
                if (status.value === "editing") {
                  let doc = {
                    ...formData.value[key],
                    updatedBy: userId,
                  };
                  entries.value[currentIndex.value] = doc;
                  status.value = null;
                  return doc;
                } else {
                  let doc = {
                    ...formData.value[key],
                    createdBy: userId,
                  };
                  entries.value.push(doc);
                  status.value = null;
                  return doc;
                }
              },
              remove: (index) => {
                entries.value.splice(index, 1);
              },
              start: (payload = {}) => {
                formData.value[key] = {
                  ...new entity({
                    ...payload,
                    ...((configure[key] && configure[key].initialData) || {}),
                  }),
                };
                status.value = "new";
              },
            }
          : {
              clear: () => {
                formData.value[key] = {};
                status.value = null;
              },
              edit: (entry) => {
                formData.value[key] = { ...entry };
                status.value = "editing";
              },
              remove: () => {
                entry.value = {};
              },
              save: () => {
                let doc = {
                  ...formData.value[key],
                  ...(status.value === "editing"
                    ? { updatedBy: userId }
                    : { createdBy: userId }),
                };
                entry.value = doc;
                status.value = null;
                return doc;
              },
              start: (payload) => {
                formData.value = {
                  ...formData.value,
                  [key]: new entity({
                    ...payload,
                    ...((configure[key] && configure[key].initialData) || {}),
                  }),
                };

                status.value = "new";
              },
            };

      return {
        ...models,
        [key]: {
          ...actions,
          currentIndex,
          entry,
          entries,
          errors,
          initialData,
          isActive,
          model: entity,
          status,
        },
      };
    }, {});

    let watchers = bindings.map(({ source, destination, from, to }) =>
      watch(
        [
          () => formData.value[source][from],
          () => formData.value[destination][to],
        ],
        async ([sourceValue, destinationValue], [oldFrom]) => {
          if ((oldFrom && oldFrom !== sourceValue) || sourceValue) {
            if (
              sourceValue !== undefined &&
              destinationValue !== undefined &&
              sourceValue !== destinationValue
            ) {
              formData.value[destination][to] = sourceValue;
            }
          }
        },
        { deep: true, immediate: true }
      )
    );

    let defaultInsert = () => {
      console.log("inserted");
    };
    let defaultUpdate = () => {
      console.log("updated");
    };
    let defaultEdit = () => {
      console.log("edit");
    };
    let defaultLoad = () => {
      console.log("load");
    };
    let defaultError = () => {
      console.log("error");
    };
    let defaultComplete = () => {
      console.log("complete");
    };
    let defaultRemove = () => {
      console.log("complete");
    };

    let handleComplete = (fn) => {
      watch(status, (val) => {
        if (val === "complete" || val === null) {
          fn();
        }
      });
    };

    let handleRemove = (
      fn = (data) => {
        console.log(data);
      }
    ) => {
      handleRemove = function (v) {
        if (typeof fn !== "function") return v;
        fn(v);
      };
      return handleRemove;
    };

    let handleEdit = (
      fn = (data) => {
        console.log(data);
      }
    ) => {
      handleEdit = function (v) {
        if (typeof fn !== "function") return v;
        fn(v);
      };
      return handleEdit;
    };

    let handleError = (
      fn = (data) => {
        console.log(data);
      }
    ) => {
      handleError = function (v) {
        if (typeof fn !== "function") return v;
        fn(v);
      };
      return handleError;
    };

    let handleInsert = (fn) => {
      handleInsert = function (v) {
        fn(v);
      };
      return handleInsert;
    };

    let handleLoad = (fn) => {
      handleLoad = async function (v) {
        return fn(v);
      };
      return handleLoad;
    };

    let handleUpdate = (fn) => {
      handleUpdate = function (v) {
        fn(v);
      };
      return handleUpdate;
    };

    handleInsert((handlers && handlers.handleInsert) || defaultInsert);
    handleUpdate((handlers && handlers.handleUpdate) || defaultUpdate);
    handleLoad((handlers && handlers.handleLoad) || defaultLoad);
    handleRemove((handlers && handlers.handleRemove) || defaultRemove);
    handleEdit((handlers && handlers.handleEdit) || defaultEdit);
    handleError((handlers && handlers.handleError) || defaultError);
    handleComplete((handlers && handlers.handleComplete) || defaultComplete);

    const clear = () => {
      resources.forEach((x) => models[x].clear());
      status.value = null;
    };

    const edit = (data = {}) => {
      resources.forEach((x) => models[x].edit(data[x]));
      status.value = "editing";
    };

    const save = async () => {
      resources.filter((x) => models[x].status.value);

      const currentData = resources.reduce((acc, key) => {
        return { ...acc, [key]: models[key].save() };
      }, {});

      const completeData = resources.reduce((acc, key) => {
        // models[key].save();
        return {
          ...acc,
          [key]:
            configure[key] && configure[key].isArray
              ? [...models[key].entries.value]
              : Object.entries(models[key].entry.value).length === 0
              ? false
              : { ...models[key].entry.value },
        };
      }, {});

      if (!handlers || Object.keys(handlers).length === 0) {
        status.value = null;
        return true;
      }

      if (status.value === "new" || status.value === null) {
        handleInsert({ currentData: currentData, completeData });
      } else {
        handleUpdate({ currentData: currentData, completeData });
      }
      clear();
    };

    const startSave = (data = {}) => {
      resources.forEach((x) => {
        models[x].start(data[x]);
      });
      status.value = "new";
    };

    const start = (data = {}) => {
      resources.forEach((x) => {
        models[x].start(data[x]);
      });
      status.value = "new";
    };

    const loadForm = async (val) => {
      let formdata = await handleLoad(val);
      edit(formdata);
    };

    watch(
      computed(() => statusHandler),
      (val) => {
        if (val === "new") {
          start();
        } else if (val !== "new" && val) {
          loadForm(val);
        }
      },
      { immediate: true }
    );

    if (autostart) start();

    return {
      data: formData,
      clear,
      edit,
      status,
      models,
      save,
      start,
      startSave,
      watchers,
    };
  };
// export const setValidationSchema = (fieldGroups) => {
//   let schemas = Object.keys(fieldGroups).reduce((groups, key) => {
//     return {
//       ...groups,
//       ...{
//         [key]: !fieldGroups[key].isArray
//           ? yup.object(fieldGroups[key].rules)
//           : yup.array().of(yup.object(fieldGroups[key].rules)),
//       },
//     };
//   }, {});

//   return schemas;
// };

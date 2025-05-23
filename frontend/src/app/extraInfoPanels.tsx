"use client";

import { useState, useContext } from "react";
import { Formik, Form } from "formik";
import "./globals.css";
import {
   Action,
   Attribute,
   ATTRIBUTE_LIST,
   Character,
   SKILL_LIST,
   Spell,
   TIME_ACTIONS,
} from "./types";
import { Button } from "../components/ui/button";
import { saveActionToIndexedDB, saveCharacterToIndexedDB } from "../lib/indexedDB";
import { Divider } from "@/components/ui/Divider";
import { AppContext } from "./context";
import InputSmartNumber from "@/components/ui/inputSmartNumber";
import { copyCharacter } from "lib/utils";
import SkillRow from "./skillRow";
import { TabCollection } from "@/components/ui/TabCollection";
import { Tab } from "@/components/ui/Tab";
import { Switch } from "../components/ui/switch";
import { Autocomplete } from "../components/ui/Autocomplete";
import { Input } from "../components/ui/input";
import { FormInput } from "../components/ui/form/FormInput";
import { FormInputSmartNumber } from "@/components/ui/form/FormInputSmartNumber";

export default function ExtraInfoPanels() {
   const context = useContext(AppContext);
   if (!context) {
      throw new Error("AppContext must be used within a Provider");
   }

   const { actions, setActions, character, setCharacter } = context;
   const [activeTab, setActiveTab] = useState(0);
   const [isSpell, setIsSpell] = useState(false);

   if (!character) {
      return null;
   }

   // Define spell level options for the autocomplete
   const spellLevelOptions = [
      { value: "cantrip", label: "Cantrip" },
      { value: "1", label: "1st Level" },
      { value: "2", label: "2nd Level" },
      { value: "3", label: "3rd Level" },
      { value: "4", label: "4th Level" },
      { value: "5", label: "5th Level" },
      { value: "6", label: "6th Level" },
      { value: "7", label: "7th Level" },
      { value: "8", label: "8th Level" },
      { value: "9", label: "9th Level" },
   ];
   const timeOptions = TIME_ACTIONS.map((time) => ({
      value: time,
      label: time.charAt(0).toUpperCase() + time.slice(1),
   }));

   const handleSubmit = async (values: FormValues, { resetForm }: any) => {
      console.log("submitting values", values);

      const formattedValues: Action = {
         ...values,
         id: 0, // ID will be generated by IndexedDB
         characterID: character.id,
         triggers: values.triggers.split(",").map((t) => t.trim()),
      };

      if (!isSpell) {
         delete formattedValues.spell;
      }

      try {
         const id = await saveActionToIndexedDB(formattedValues);
         setActions((prev) => [...prev, formattedValues]);
         resetForm();
      } catch (error) {
         console.error("Error saving action:", error);
      }
   };

   const handleAttributeChange = async (key: keyof Character["attributes"], value: number) => {
      if (!character) return;
      const newAttribute = new Attribute(value);
      const updatedCharacter = copyCharacter(character);
      updatedCharacter.attributes[key] = newAttribute;
      setCharacter(updatedCharacter);
      saveCharacterToIndexedDB(updatedCharacter);
   };

   type FormValues = Omit<Action, "triggers" | "id" | "characterID"> & {
      triggers: string;
   };

   return (
      <div className="flex flex-1 flex-col m-4 text-contrast-10 bg-contrast-1">
         {/* Tabs */}
         <TabCollection
            labels={["Add Action", "Attributes", "Inventory"]}
            onChange={(index) => setActiveTab(index)}
         />

         {/* Tab Content */}
         <div className="p-4">
            {activeTab === 0 && (
               <div>
                  <div className="flex-1 flex bg-contrast-1 justify-center items-center">
                     <Formik<FormValues>
                        initialValues={{
                           title: "",
                           description: "",
                           time: undefined,
                           attack: undefined,
                           triggers: "",
                           spell: {
                              level: "cantrip",
                              school: "",
                              components: {
                                 verbal: false,
                                 somatic: false,
                                 material: "",
                              },
                              concentration: false,
                              classes: [],
                              ritual: false,
                           },
                        }}
                        onSubmit={(values, formikHelpers) => {
                           handleSubmit(values, formikHelpers);
                        }}
                     >
                        {({ values, setFieldValue }) => (
                           <Form className="bg-contrast-2 p-6 rounded shadow-md w-full max-w-md">
                              <h2 className="text-xl font-bold mb-4">Add New Action</h2>
                              <div className="mb-4">
                                 <label className="block mb-1" htmlFor="title">
                                    Title
                                 </label>
                                 <FormInput name="title" placeholder="Action Title" />
                              </div>
                              <div className="mb-4">
                                 <label className="block mb-1" htmlFor="description">
                                    Description
                                 </label>
                                 <FormInput
                                    name="description"
                                    placeholder="Action Description"
                                    type="textarea"
                                 />
                              </div>
                              <div className="mb-4">
                                 <label className="block mb-1" htmlFor="time">
                                    Time
                                 </label>
                                 <Autocomplete
                                    items={timeOptions}
                                    value={values.time || null}
                                    onSelect={(value) => setFieldValue("time", value)}
                                    placeholder="Select action time"
                                 />
                              </div>
                              <div className="mb-4">
                                 <label className="block mb-1" htmlFor="triggers">
                                    Triggers (comma-separated)
                                 </label>
                                 <FormInput
                                    name="triggers"
                                    placeholder="e.g., Enemy casts spell, Bonus Action"
                                 />
                              </div>
                              <Divider />
                              <div className="my-4">
                                 <label className="flex items-center gap-2">
                                    <Switch
                                       checked={!!values.attack}
                                       onCheckedChange={(checked) =>
                                          setFieldValue(
                                             "attack",
                                             checked
                                                ? {
                                                     damage: "",
                                                     type: "",
                                                     range: { normal: 0, long: undefined },
                                                     areaOfEffect: { shape: "cone", size: 0 },
                                                  }
                                                : undefined
                                          )
                                       }
                                    />
                                    Does damage/healing?
                                 </label>
                              </div>
                              {values.attack && (
                                 <div>
                                    <div className="mb-4">
                                       <label className="block mb-1">Damage</label>
                                       <div className="flex gap-6">
                                          <FormInput
                                             name="attack.damage"
                                             placeholder="2d6 + 2"
                                             // className="w-1/2 p-2 rounded bg-contrast-3 text-contrast-10"
                                          />
                                          <FormInput
                                             name="attack.type"
                                             placeholder="slashing, necrotic, etc."
                                             // className="w-1/2 p-2 rounded bg-contrast-3 text-contrast-10"
                                          />
                                       </div>
                                    </div>
                                    <div className="mb-4">
                                       <label className="block mb-1">Range</label>
                                       <div className="flex gap-6 items-center">
                                          <div className="flex direction-row gap-2 items-center">
                                             <FormInputSmartNumber
                                                name="attack.range.normal"
                                                placeholder="Normal"
                                                className="w-full"
                                             />
                                             <span>feet</span>
                                          </div>
                                          <div className="flex direction-row gap-2 items-center">
                                             <FormInputSmartNumber
                                                name="attack.range.long"
                                                placeholder="Long"
                                             />
                                             <span>feet</span>
                                          </div>
                                          {/* <InputSmartNumber
                                             value={character?.attributes[attribute]?.amount ?? 10}
                                             onChange={(value) =>
                                                handleAttributeChange(
                                                   attribute,
                                                   Number(value.target.value)
                                                )
                                             }
                                          /> */}
                                       </div>
                                    </div>
                                    <div className="mb-4">
                                       <label className="block mb-1">Area of Effect</label>
                                       <div className="flex gap-6 items-center">
                                          <div className="flex flex-1 direction-row gap-2 items-center">
                                             <FormInputSmartNumber
                                                name="attack.areaOfEffect.size"
                                                placeholder="Normal"
                                             />
                                             <span>feet</span>
                                          </div>
                                          <div className="flex-1 w-10">
                                             <Autocomplete
                                                items={[
                                                   { value: "cone", label: "Cone" },
                                                   { value: "sphere", label: "Sphere" },
                                                   { value: "cube", label: "Cube" },
                                                   { value: "line", label: "Line" },
                                                   { value: "other", label: "Other" },
                                                ]}
                                                value={values.attack.areaOfEffect?.shape || null}
                                                onSelect={(value) =>
                                                   setFieldValue("attack.areaOfEffect.shape", value)
                                                }
                                                placeholder="Shape"
                                                buttonClassName="w-full"
                                                inputClassName="w-full"
                                                contentClassName="w-full"
                                             />
                                          </div>
                                       </div>
                                    </div>
                                 </div>
                              )}
                              <Divider />
                              <div className="my-4">
                                 <label className="flex items-center gap-2">
                                    <Switch
                                       checked={isSpell}
                                       onCheckedChange={(checked) => setIsSpell(checked)}
                                    />
                                    Is spell?
                                 </label>
                              </div>
                              {isSpell && (
                                 <div>
                                    <div className="mb-4">
                                       <label className="block mb-1" htmlFor="spell-level">
                                          Level
                                       </label>
                                       <Autocomplete
                                          items={spellLevelOptions}
                                          value={values.spell?.level?.toString() || null}
                                          onSelect={(value) => setFieldValue("spell.level", value)}
                                          placeholder="Select spell level"
                                       />
                                    </div>
                                    <div className="mb-4">
                                       <label className="block mb-1" htmlFor="spell-school">
                                          School
                                       </label>
                                       <Input
                                          id="spell-school"
                                          type="text"
                                          value={values.spell?.school || ""}
                                          onChange={(e) =>
                                             setFieldValue("spell.school", e.target.value)
                                          }
                                       />
                                    </div>
                                    <div className="mb-4">
                                       <label className="block mb-1" htmlFor="spell-components">
                                          Components
                                       </label>
                                       <div className="mb-4">
                                          <label className="flex items-center gap-2">
                                             <Switch
                                                checked={values.spell?.components?.verbal || false}
                                                onCheckedChange={(checked) =>
                                                   setFieldValue("spell.components.verbal", checked)
                                                }
                                             />
                                             Verbal
                                          </label>
                                       </div>
                                       <div className="mb-4">
                                          <label className="flex items-center gap-2">
                                             <Switch
                                                checked={values.spell?.components?.somatic || false}
                                                onCheckedChange={(checked) =>
                                                   setFieldValue(
                                                      "spell.components.somatic",
                                                      checked
                                                   )
                                                }
                                             />
                                             Somatic
                                          </label>
                                       </div>
                                       <div className="mb-4">
                                          <label>
                                             Material Description:
                                             <Input
                                                type="text"
                                                value={values.spell?.components?.material || ""}
                                                onChange={(e) =>
                                                   setFieldValue(
                                                      "spell.components.material",
                                                      e.target.value
                                                   )
                                                }
                                             />
                                          </label>
                                       </div>
                                    </div>
                                    <div className="mb-4">
                                       <label className="flex items-center gap-2">
                                          <Switch
                                             checked={values.spell?.concentration || false}
                                             onCheckedChange={(checked) =>
                                                setFieldValue("spell.concentration", checked)
                                             }
                                          />
                                          Concentration
                                       </label>
                                    </div>
                                    <div className="mb-4">
                                       <label className="block mb-1" htmlFor="spell-classes">
                                          Classes
                                       </label>
                                       <Input
                                          id="spell-classes"
                                          type="text"
                                          value={values.spell?.classes || ""}
                                          onChange={(e) =>
                                             setFieldValue(
                                                "spell.classes",
                                                e.target.value.split(",")
                                             )
                                          }
                                       />
                                    </div>
                                    <div className="mb-4">
                                       <label className="flex items-center gap-2">
                                          <Switch
                                             checked={values.spell?.ritual || false}
                                             onCheckedChange={(checked) =>
                                                setFieldValue("spell.ritual", checked)
                                             }
                                          />
                                          Ritual
                                       </label>
                                    </div>
                                 </div>
                              )}
                              <div className="my-4">
                                 <label className="flex items-center gap-2">
                                    <Switch
                                       checked={!!values.item}
                                       onCheckedChange={(checked) =>
                                          setFieldValue(
                                             "item",
                                             checked
                                                ? {
                                                     amount: 1,
                                                     charges: 0,
                                                  }
                                                : undefined
                                          )
                                       }
                                    />
                                    Is item?
                                 </label>
                              </div>
                              {values.item && (
                                 <div>
                                    <div className="mb-4">
                                       <label className="block mb-1">Amount</label>
                                       <FormInputSmartNumber
                                          name="item.amount"
                                          className="w-full p-2 rounded bg-contrast-3 text-contrast-10"
                                       />
                                    </div>
                                    <div className="mb-4">
                                       <label className="block mb-1">Charges</label>
                                       <FormInputSmartNumber
                                          name="item.charges"
                                          className="w-full p-2 rounded bg-contrast-3 text-contrast-10"
                                       />
                                    </div>
                                    <div className="mb-4">
                                       <label className="block mb-1">Charges refill on</label>
                                       <Autocomplete
                                          items={timeOptions}
                                          value={values.item.chargesRefillOn || null}
                                          onSelect={(value) =>
                                             setFieldValue("item.chargesRefillOn", value)
                                          }
                                          placeholder="Select time action"
                                       />
                                    </div>
                                 </div>
                              )}
                              <Button type="submit" className="w-full">
                                 Add Action
                              </Button>
                           </Form>
                        )}
                     </Formik>
                  </div>
               </div>
            )}

            {activeTab === 1 && (
               <div>
                  <div className="flex flex-col gap-6 h-full">
                     {/* Attributes Section */}
                     <div className="grid grid-cols-6 gap-4">
                        {ATTRIBUTE_LIST.map((attribute) => (
                           <div key={attribute} className="flex flex-col items-center">
                              <div className="text-sm font-bold mb-1">
                                 {attribute.toUpperCase()}
                              </div>
                              <div className="bg-contrast-2 text-contrast-10 w-16 h-16 flex items-center justify-center rounded">
                                 {character?.attributes[attribute]?.getModifierString() ?? 10}
                              </div>
                              <div className="bg-contrast-3 relative top-[-15px]">
                                 <InputSmartNumber
                                    value={character?.attributes[attribute]?.amount ?? 10}
                                    onChange={(value) =>
                                       handleAttributeChange(attribute, Number(value.target.value))
                                    }
                                    className="w-9 text-contrast-10 text-center bg-contrast-3 opacity-100 rounded px-0"
                                 />
                              </div>
                           </div>
                        ))}
                     </div>

                     <Divider />

                     {/* Skills Section */}
                     <div className="grid grid-cols-2 gap-x-10 gap-y-4">
                        {SKILL_LIST.map((skill) => (
                           <SkillRow key={skill} skillKey={skill} />
                        ))}
                     </div>
                  </div>
               </div>
            )}

            {activeTab === 2 && (
               <div>
                  <div className="flex flex-col gap-6 h-full">
                     <h2 className="text-lg font-bold">Inventory</h2>
                     <div className="grid grid-cols-1 gap-4">
                        {actions
                           .filter((action) => action.item)
                           .map((action) => (
                              <div key={action.id} className="p-4 border rounded bg-contrast-2">
                                 <h3 className="text-md font-semibold">{action.title}</h3>
                                 {action?.description && <p>{action?.description}</p>}
                                 {action.item?.amount && <p>Amount: {action.item.amount}</p>}
                                 {action.item?.charges ? (
                                    <p>Charges: {action.item.charges}</p>
                                 ) : undefined}
                                 {action.item?.chargesRefillOn && (
                                    <p>Charges Refill On: {action.item.chargesRefillOn}</p>
                                 )}
                              </div>
                           ))}
                     </div>
                  </div>
               </div>
            )}
         </div>
      </div>
   );
}

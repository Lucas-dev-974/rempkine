import { createSignal, onMount } from "solid-js";
import { DialogWrapper } from "../dialog/DialogWrapper";
import { LabeledInput } from "../inputs/LabeledInput";
import { AuthorsEnum, GenderEnum } from "../../utils/PDFTool";
import { RadioButtons } from "../inputs/DialogToInputRadio";
import { Button } from "../buttons/Button";
import { UserEntity } from "../../models/user.entity";
import storeService from "../../utils/store.service";

export function RegisterInformationsInLocal(props: { isInNavbar?: boolean }) {

    const [title, setTitle] = createSignal<string>("Enregistrer vos Informations");
    const [name, setName] = createSignal<string>("");
    const [email, setEmail] = createSignal<string>("");
    const [orderNumber, setOrderNumber] = createSignal<number>(0);
    const [department, setDepartment] = createSignal<string>("");
    const [birthday, setBirthday] = createSignal<Date>(new Date());
    const [bornLocation, setBornLocation] = createSignal<string>("");
    const [personalAdress, setPersonalAdress] = createSignal<string>("");
    const [officeAdress, setOfficeAdress] = createSignal<string>("");
    const [gender, setGender] = createSignal<GenderEnum>(GenderEnum.male);

    function saveInformations() {
        const informations: UserEntity = {
            fullname: name(),
            email: email(),
            orderNumber: orderNumber(),
            department: department(),
            birthday: birthday(),
            bornLocation: bornLocation(),
            personalAdress: personalAdress(),
            officeAdress: officeAdress(),
            gender: gender(),
            status: AuthorsEnum.professional,
        }

        storeService.proxy.user = informations;
    }

    function ignitTitle() {
        if (props.isInNavbar) {
            setTitle("Modifier vos Informations");
        } else {
            setTitle("Enregistrer vos Informations");
        }
    }

    function ignitUserInformations() {
        if (storeService.proxy.user) {
            setName(storeService.proxy.user.fullname);
            setEmail(storeService.proxy.user.email);
            setOrderNumber(storeService.proxy.user.orderNumber ?? 0);
            setDepartment(storeService.proxy.user.department);
            setBirthday(storeService.proxy.user.birthday);
            setBornLocation(storeService.proxy.user.bornLocation);
        }
    }

    onMount(() => {
        ignitTitle();
        ignitUserInformations();
    })

    return (
        <DialogWrapper
            btnText={title()}
            title={title()}
            isInNavbar={props.isInNavbar}
        >
            <div class="p-3 max-h-[70vh]">
                <LabeledInput
                    id="name"
                    label="Nom"
                    type="text"
                    value={name()}
                    onInput={(e) => setName(e.target.value)}
                />
                <LabeledInput
                    id="email"
                    label="Email"
                    type="text"
                    value={email()}
                    onInput={(e) => setEmail(e.target.value)}
                />
                <LabeledInput
                    id="orderNumber"
                    label="Numéro d'ordre"
                    type="number"
                    value={orderNumber().toString()}
                    onInput={(e) => setOrderNumber(Number(e.target.value))}
                />
                <LabeledInput
                    id="department"
                    label="Département"
                    type="text"
                    value={department()}
                    onInput={(e) => setDepartment(e.target.value)}
                />
                <LabeledInput
                    id="birthday"
                    label="Date de naissance"
                    type="date"
                    value={birthday().toDateString() ?? "z"}
                    onInput={(e) => setBirthday(new Date(e.target.value))}
                />
                <LabeledInput
                    id="bornLocation"
                    label="Lieu de naissance"
                    type="text"
                    value={bornLocation()}
                    onInput={(e) => setBornLocation(e.target.value)}
                />

                <LabeledInput
                    id="personalAdress"
                    label="Adresse personnelle"
                    type="text"
                    value={personalAdress()}
                    onInput={(e) => setPersonalAdress(e.target.value)}
                />
                <LabeledInput
                    id="officeAdress"
                    label="Adresse professionnelle"
                    type="text"
                    value={officeAdress()}
                    onInput={(e) => setOfficeAdress(e.target.value)}
                />
                <RadioButtons
                    name="gender"
                    value={gender()}
                    onChange={(e: Event) => setGender((e.target as HTMLInputElement).value as GenderEnum)}
                    legend="Genre"
                    items={[
                        { text: "Homme", value: "male", id: "genderM" },
                        { text: "Femme", value: "female", id: "genderF" },
                    ]}
                />


                <div class="flex justify-end">
                    <Button text="Enregistrer" onClick={saveInformations} />
                </div>
            </div>
        </DialogWrapper>
    )
}
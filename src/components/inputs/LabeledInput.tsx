import { onMount, onCleanup, createEffect } from "solid-js";

interface LabeledInputProps {
  id: string;
  label: string;
  type: "text" | "mail" | "date" | "number" | "password" | "textarea";
  placeholder?: string;

  value?: string;
  required?: boolean;

  onInput?: (e: Event & { target: any & { value: string } }) => void;
  onChange?: (e: Event & { target: any & { value: string } }) => void;
}

export function LabeledInput(props: LabeledInputProps) {
  let inputRef: HTMLInputElement | undefined;

  onMount(() => {
    if (!inputRef || !props.onInput) return;

    // Stocker la dernière valeur connue du signal (props.value)
    let lastSignalValue = props.value || "";
    // Stocker la dernière valeur connue du DOM
    let lastDOMValue = inputRef.value;
    let isUserTyping = false;
    let lastInputEventTime = 0;

    // Fonction pour déclencher le handler onInput
    const triggerInputHandler = (skipCheck = false, reason = "") => {
      if (!inputRef || !props.onInput) return;

      const currentDOMValue = inputRef.value;
      const currentSignalValue = props.value || "";

      // Vérifier si la valeur DOM a changé par rapport à la dernière valeur connue
      // OU si la valeur DOM diffère de la valeur du signal (autofill détecté)
      const domValueChanged = currentDOMValue !== lastDOMValue;
      const domDiffersFromSignal = currentDOMValue !== currentSignalValue && currentDOMValue !== "";

      if (import.meta.env.DEV && (domValueChanged || domDiffersFromSignal)) {
        console.log(`[LabeledInput ${props.id}] Autofill détecté:`, {
          reason,
          domValue: currentDOMValue,
          signalValue: currentSignalValue,
          lastDOMValue,
          domValueChanged,
          domDiffersFromSignal,
        });
      }

      if (skipCheck || domValueChanged || domDiffersFromSignal) {
        lastDOMValue = currentDOMValue;
        lastSignalValue = currentDOMValue;
        lastInputEventTime = Date.now();

        // Créer un événement synthétique pour maintenir la compatibilité
        const syntheticEvent = new Event("input", { bubbles: true, cancelable: true });
        Object.defineProperty(syntheticEvent, "target", {
          value: inputRef,
          enumerable: true,
          writable: false,
          configurable: false,
        });

        // Appeler le handler
        props.onInput(syntheticEvent as Event & { target: any & { value: string } });
      }
    };

    // MutationObserver pour détecter les changements d'attribut 'value'
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "attributes" && mutation.attributeName === "value") {
          // Ne déclencher que si ce n'est pas l'utilisateur qui tape
          if (!isUserTyping) {
            setTimeout(() => triggerInputHandler(false, "MutationObserver"), 0);
          }
        }
      });
    });

    // Observer les changements d'attribut 'value' sur l'input
    observer.observe(inputRef, {
      attributes: true,
      attributeFilter: ["value"],
      attributeOldValue: true,
    });

    // Détecter quand l'utilisateur tape (pour éviter les faux positifs)
    const handleInput = () => {
      isUserTyping = true;
      lastInputEventTime = Date.now();
      lastDOMValue = inputRef?.value || "";
      setTimeout(() => {
        isUserTyping = false;
      }, 200);
    };

    const handleKeyDown = () => {
      isUserTyping = true;
      setTimeout(() => {
        isUserTyping = false;
      }, 200);
    };

    // Détecter l'autofill via l'événement animationstart (hack connu)
    const handleAnimationStart = (e: AnimationEvent) => {
      if (e.animationName === "onAutoFillStart" || e.animationName === "onAutoFillCancel") {
        setTimeout(() => triggerInputHandler(true, "AnimationStart"), 50);
      }
    };

    // Polling continu mais optimisé : vérifier périodiquement
    // On vérifie même sans focus car l'autofill peut se produire à tout moment
    const pollInterval = setInterval(() => {
      if (!inputRef || !props.onInput) return;

      const currentDOMValue = inputRef.value;
      const currentSignalValue = props.value || "";
      const timeSinceLastInput = Date.now() - lastInputEventTime;

      // Ne vérifier que si :
      // 1. Pas de saisie utilisateur récente (évite les conflits)
      // 2. La valeur DOM diffère de la valeur du signal (autofill probable)
      // 3. La valeur DOM a changé depuis la dernière vérification
      if (timeSinceLastInput > 300 && !isUserTyping) {
        if (currentDOMValue !== currentSignalValue && currentDOMValue !== "" && currentDOMValue !== lastDOMValue) {
          triggerInputHandler(true, "Polling (diff signal)");
        } else if (currentDOMValue !== lastDOMValue) {
          triggerInputHandler(false, "Polling (changement DOM)");
        }
      }

      // Mettre à jour la référence même si pas de changement
      lastDOMValue = currentDOMValue;
    }, 200); // Vérifier toutes les 200ms

    // Vérifier au blur (l'autofill peut se produire juste avant)
    const handleBlur = () => {
      setTimeout(() => {
        if (inputRef) {
          triggerInputHandler(true, "Blur");
        }
      }, 150);
    };

    // Réagir aux changements de props.value (quand le signal change)
    createEffect(() => {
      if (props.value !== undefined) {
        lastSignalValue = props.value;
        // Si la valeur du signal change mais pas celle du DOM, c'est normal (mise à jour programmatique)
        // On met juste à jour la référence
        if (inputRef && inputRef.value === props.value) {
          lastDOMValue = props.value;
        }
      }
    });

    // Ajouter les event listeners
    inputRef.addEventListener("input", handleInput);
    inputRef.addEventListener("keydown", handleKeyDown);
    inputRef.addEventListener("animationstart", handleAnimationStart as EventListener);
    inputRef.addEventListener("blur", handleBlur);

    // Nettoyer lors du démontage
    onCleanup(() => {
      observer.disconnect();
      clearInterval(pollInterval);
      if (inputRef) {
        inputRef.removeEventListener("input", handleInput);
        inputRef.removeEventListener("keydown", handleKeyDown);
        inputRef.removeEventListener("animationstart", handleAnimationStart as EventListener);
        inputRef.removeEventListener("blur", handleBlur);
      }
    });
  });

  return (
    <div class={"grid grid-cols-1 form-input py-1"}>
      <label class="font-[Nunito]" for={props.id}>{props.label}</label>
      <input
        ref={inputRef}
        class="border border-gray-300 rounded-lg py-2 px-3 bg-transparent shadow-sm focus:outline-none resize-none   outline-none font-[Nunito]"
        type={props.type}
        id={props.id}
        name={props.id}
        placeholder={props.placeholder ? props.placeholder : ""}
        onInput={(e) => props.onInput && props.onInput(e)}
        value={props.value || ""}
        required={props.required}
      />
    </div>
  );
}

import { assertExists } from "@oliversalzburg/js-utils/lib/nil";
import { Task } from "@plantdb/libplantdb";
import { t } from "i18next";
import { css, html } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { TaskPropertiesForm } from "../TaskPropertiesForm";
import { View } from "./View";

@customElement("pn-task-properties-view")
export class TaskPropertiesView extends View {
  static readonly styles = [
    ...View.styles,
    css`
      #form {
        padding: 0 5vw;
        flex: 1;
      }

      @media (min-width: 1000px) {
        #form {
          padding: 0 15vw;
        }
      }
      @media (min-width: 2000px) {
        #form {
          padding: 0 25vw;
        }
      }

      .footer {
        display: flex;
        justify-content: flex-end;
        gap: 0.5rem;
        padding: 1rem;
      }
      :host(.scanning) .footer {
        display: none;
      }
    `,
  ];

  @property({ attribute: false })
  task: Task | undefined;

  @query("#form")
  private _form: TaskPropertiesForm | null | undefined;

  save() {
    assertExists(this._form);

    // Check if the user wants to delete.
    if (!this._form.shouldDelete()) {
      // If they don't, then the form needs to be valid to proceed.
      if (!this._form.reportValidity()) {
        return;
      }
    }

    const event = new CustomEvent("pn-saved", {
      bubbles: true,
      cancelable: true,
      composed: true,
      detail: this._form.asTask(),
    });
    this.dispatchEvent(event);

    if (!event.defaultPrevented) {
      this.plantStoreUi?.navigateTo("tasks");
    }
  }

  cancel() {
    const event = new CustomEvent("pn-cancelled", {
      bubbles: true,
      cancelable: true,
      composed: true,
      detail: this._form?.asTask(),
    });
    this.dispatchEvent(event);

    if (!event.defaultPrevented) {
      this.plantStoreUi?.navigateTo("tasks");
    }
  }

  render() {
    return [
      html`<pn-task-properties-form
          id="form"
          .plantStore=${this.plantStore}
          .plantStoreUi=${this.plantStoreUi}
          .task=${this.task}
        ></pn-task-properties-form>
        <section class="footer">
          <sl-button
            variant="primary"
            @click=${() => {
              this.save();
            }}
            >${t("save", { ns: "common" })}</sl-button
          ><sl-button
            @click=${() => {
              this.cancel();
            }}
            >${t("cancel", { ns: "common" })}</sl-button
          >
        </section>`,
    ];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "pn-task-properties-view": TaskPropertiesView;
  }
}

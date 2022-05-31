import "@shoelace-style/shoelace/dist/components/alert/alert";
import "@shoelace-style/shoelace/dist/components/button/button";
import "@shoelace-style/shoelace/dist/components/checkbox/checkbox";
import "@shoelace-style/shoelace/dist/components/details/details";
import "@shoelace-style/shoelace/dist/components/dialog/dialog";
import "@shoelace-style/shoelace/dist/components/divider/divider";
import "@shoelace-style/shoelace/dist/components/drawer/drawer";
import "@shoelace-style/shoelace/dist/components/icon/icon";
import "@shoelace-style/shoelace/dist/components/input/input";
import "@shoelace-style/shoelace/dist/components/menu-item/menu-item";
import "@shoelace-style/shoelace/dist/components/select/select";
import "@shoelace-style/shoelace/dist/components/tag/tag";
import "@shoelace-style/shoelace/dist/components/textarea/textarea";
import "@shoelace-style/shoelace/dist/components/tooltip/tooltip";
import "@shoelace-style/shoelace/dist/translations/de";
import "@shoelace-style/shoelace/dist/translations/en";
import "@shoelace-style/shoelace/dist/translations/he";
import { setBasePath } from "@shoelace-style/shoelace/dist/utilities/base-path.js";
import "./PlantApp";
import "./PlantCard";
import "./PlantDbConfig";
import "./PlantDetails";
import "./PlantDetailsForm";
import "./PlantDygraph";
import "./PlantEmptyState";
import "./PlantGeekInfo";
import "./PlantList";
import "./PlantLog";
import "./PlantLogEntry";
import "./PlantLogEntryForm";
import "./PlantMultiValueEditor";
import "./PlantTypeMap";
import "./stores/PlantStore";
import "./stores/PlantStoreUi";
import "./views/Plant404View";
import "./views/PlantDetailsView";
import "./views/PlantImportView";
import "./views/PlantListView";
import "./views/PlantLogView";
import "./views/PlantTypeMapView";

setBasePath(import.meta.env.BASE_URL);

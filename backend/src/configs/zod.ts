import { z } from "zod";

// Deixa as mensagens padrão do Zod em português (as que não foram escritas à mão nos schemas).
z.config(z.locales.pt());

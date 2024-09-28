import { Context, Schema } from "koishi";
import type { Argv } from "koishi";

export const name = "advanced-echo";

export interface Config {
    template: string[];
    parameters: string[];
}

export const Config: Schema<Config> = Schema.intersect([
    Schema.object({
        template: Schema.array(
            Schema.string()
                .role("textarea", { rows: [4, 10] })
                .required()
                .description("回应模板")
        )
            .default(["%%message%%"])
            .description("回应模板列表")
    }).description("回应模板"),
    Schema.object({
        parameters: Schema.array(Schema.string().required().description("参数名称")).default(["message"]).description("参数名称列表")
    }).description("参数名称")
]);

export function apply(ctx: Context, config: Config): void {
    ctx.command(
        "aecho <selection:number> [...message:string]",
        "输出自定义的一段文字。\n第一个参数为模板编号，后续参数为模板中参数的值。"
    ).action((_: Argv, selection: number, ...message: string[]): string => {
        if (selection < 1 || selection > config.template.length) {
            return "回应模板不存在。";
        }
        return config.template[selection - 1].replace(
            /%%(\w+)%%/g,
            (match: string, name: string) => {
                const index: number = config.parameters.indexOf(name);
                return index >= 0 ? message[index] : match;
            }
        );
    });
}

import { json as json$1 } from '@sveltejs/kit';
import path from "path"
const preset_data = import.meta.glob('../../../../static/presets/*.json');

export async function GET() {
    let presets = Object.keys(preset_data).map(filepath => path.basename(filepath));
    return json$1({ data: presets })
}

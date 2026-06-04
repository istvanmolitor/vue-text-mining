import { MenuBuilder, type MenuItemConfig } from '@menu/index'
import { ScanText, FileText, KeyRound } from 'lucide-vue-next'

export class TextMiningMenuBuilder extends MenuBuilder {
  build(menu: MenuItemConfig, menuName: string): MenuItemConfig {
    if (menuName === 'admin') {
      return this.buildMainMenu(menu)
    }

    return menu
  }

  private buildMainMenu(menu: MenuItemConfig): MenuItemConfig {
    const textMiningSection: MenuItemConfig = {
      id: 'text-mining',
      title: 'Szovegbanyaszat',
      icon: ScanText,
      order: 35,
      permission: 'text-mining',
      children: [
        {
          id: 'text-mining-corpus-texts',
          title: 'CorpusText',
          path: '/admin/text-mining/corpus-text',
          icon: FileText,
          order: 10,
          permission: 'text-mining'
        },
        {
          id: 'text-mining-keywords',
          title: 'Keyword',
          path: '/admin/text-mining/keyword',
          icon: KeyRound,
          order: 20,
          permission: 'text-mining'
        }
      ]
    }

    this.addMenuItem(menu, textMiningSection)

    return menu
  }
}

export const textMiningMenuBuilder = new TextMiningMenuBuilder()

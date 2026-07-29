<template>
  <section
    data-testid="btnlauncher2-account-panel"
    class="btnlauncher2-account-panel surface-card-subsection"
    :aria-label="t('btnlauncher2Account.title')"
  >
    <div class="flex items-start justify-between gap-4">
      <div>
        <div class="flex items-center gap-2">
          <v-icon color="primary" aria-hidden="true">verified_user</v-icon>
          <h2 class="text-lg font-semibold">{{ t('btnlauncher2Account.title') }}</h2>
        </div>
        <p class="mt-1 text-sm opacity-60">{{ t('btnlauncher2Account.description') }}</p>
      </div>
      <v-chip :color="account ? accountStatusColor : undefined" size="small" variant="tonal">
        {{ account ? t(`btnlauncher2Account.status.${account.status}`) : t('btnlauncher2Account.guest') }}
      </v-chip>
    </div>

    <v-alert
      v-if="conflict"
      data-testid="btnlauncher2-account-conflict"
      type="warning"
      variant="tonal"
      class="mt-4"
    >
      {{ t('btnlauncher2Account.identityConflict', { provider: providerName(conflict.provider) }) }}
      <template #append>
        <v-btn
          v-if="session"
          data-testid="btnlauncher2-account-merge-prepare"
          size="small"
          variant="tonal"
          :loading="busy"
          @click="prepareMerge"
        >
          {{ t('btnlauncher2Account.reviewMerge') }}
        </v-btn>
        <span v-else class="text-xs">{{ t('btnlauncher2Account.mergeNeedsSession') }}</span>
      </template>
    </v-alert>

    <v-alert
      v-if="mergePreview"
      data-testid="btnlauncher2-account-merge-preview"
      type="info"
      variant="tonal"
      class="mt-4"
    >
      <div class="font-medium">{{ t('btnlauncher2Account.mergePreview') }}</div>
      <ul class="mt-2 text-sm">
        <li v-for="resource in mergePreview.resources" :key="resource.type">
          {{ resource.type
          }}<template v-if="resource.count !== undefined">: {{ resource.count }}</template>
        </li>
      </ul>
      <v-btn
        data-testid="btnlauncher2-account-merge-confirm"
        class="mt-3"
        size="small"
        color="primary"
        :loading="busy"
        @click="confirmMerge"
      >
        {{ t('btnlauncher2Account.confirmMerge') }}
      </v-btn>
    </v-alert>

    <v-alert v-if="mergeTaskId" type="success" variant="tonal" class="mt-4">
      {{ t('btnlauncher2Account.mergeQueued') }}
    </v-alert>

    <v-alert v-if="error" type="error" variant="tonal" class="mt-4">
      {{ t('btnlauncher2Account.requestFailed') }}
    </v-alert>

    <template v-if="account">
      <div class="btnlauncher2-account-grid mt-4">
        <div class="surface-card-row rounded-xl p-4">
          <div class="text-xs font-semibold uppercase tracking-wider opacity-50">
            {{ t('btnlauncher2Account.accountSummary') }}
          </div>
          <div class="mt-2 font-mono text-sm break-all">{{ account.accountId }}</div>
          <div class="mt-1 text-xs opacity-60">
            {{ t('btnlauncher2Account.createdAt', { date: formatDate(account.createdAt) }) }}
          </div>
        </div>

        <div class="surface-card-row rounded-xl p-4">
          <div class="flex items-center justify-between">
            <div class="text-xs font-semibold uppercase tracking-wider opacity-50">
              {{ t('btnlauncher2Account.session') }}
            </div>
            <v-chip :color="sessionExpired ? 'warning' : 'success'" size="x-small" variant="tonal">
              {{
                sessionExpired ? t('btnlauncher2Account.sessionExpired') : t('btnlauncher2Account.sessionActive')
              }}
            </v-chip>
          </div>
          <div class="mt-2 text-sm">
            {{
              session ? t('btnlauncher2Account.expiresAt', { date: formatDate(session.expiresAt) }) : '—'
            }}
          </div>
          <div class="mt-3 flex flex-wrap gap-2">
            <v-btn
              data-testid="btnlauncher2-session-refresh"
              size="small"
              variant="tonal"
              :loading="busy"
              @click="refreshSession"
            >
              {{ t('shared.refresh') }}
            </v-btn>
            <v-btn
              data-testid="btnlauncher2-session-revoke"
              size="small"
              variant="text"
              :disabled="busy"
              @click="revokeSession(false)"
            >
              {{ t('btnlauncher2Account.signOutDevice') }}
            </v-btn>
            <v-btn size="small" variant="text" :disabled="busy" @click="revokeSession(true)">
              {{ t('btnlauncher2Account.signOutAll') }}
            </v-btn>
          </div>
        </div>
      </div>
    </template>

    <div class="mt-5">
      <div v-if="!account" class="text-sm font-semibold">
        {{ t('btnlauncher2Account.linkAccountWith') }}
      </div>
      <div class="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <v-btn
          data-testid="btnlauncher2-provider-microsoft"
          variant="tonal"
          :disabled="busy || isProviderLinked('microsoft')"
          @click="openMicrosoftLogin"
        >
          <v-icon start aria-hidden="true">{{
            isProviderLinked('microsoft') ? 'check' : providerIcon('microsoft')
          }}</v-icon>
          Microsoft
        </v-btn>
        <v-btn
          data-testid="btnlauncher2-provider-modrinth"
          variant="tonal"
          :disabled="busy || isProviderLinked('modrinth')"
          @click="openModrinthLogin"
        >
          <v-icon start aria-hidden="true">{{
            isProviderLinked('modrinth') ? 'check' : providerIcon('modrinth')
          }}</v-icon>
          Modrinth
        </v-btn>
        <v-btn
          data-testid="btnlauncher2-provider-google"
          variant="tonal"
          :disabled="busy || isProviderLinked('google')"
          :loading="busy && !isProviderLinked('google')"
          @click="authorizeProvider('google')"
        >
          <v-icon start aria-hidden="true">{{
            isProviderLinked('google') ? 'check' : providerIcon('google')
          }}</v-icon>
          Google
        </v-btn>
        <v-btn
          data-testid="btnlauncher2-provider-discord"
          variant="tonal"
          :disabled="busy || isProviderLinked('discord')"
          :loading="busy && !isProviderLinked('discord')"
          @click="authorizeProvider('discord')"
        >
          <v-icon start aria-hidden="true">{{
            isProviderLinked('discord') ? 'check' : providerIcon('discord')
          }}</v-icon>
          Discord
        </v-btn>
      </div>
      <p class="mt-3 text-xs opacity-60">{{ t('btnlauncher2Account.gameAccountsSeparate') }}</p>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { kBtnlauncher2Account } from '@/composables/btnlauncher2Account'
import { kModrinthAuthenticatedAPI } from '@/composables/modrinthAuthenticatedAPI'
import { useUserMenuControl } from '@/composables/userMenu'
import { injection } from '@/util/inject'
import type { Btnlauncher2AccountStatus, Btnlauncher2OAuthProvider } from '@btnlauncher2/runtime-api'

const { t, locale } = useI18n()
const {
  account,
  identities,
  session,
  conflict,
  mergePreview,
  mergeTaskId,
  sessionExpired,
  busy,
  error,
  authorizeProvider,
  prepareMerge,
  confirmMerge,
  refreshSession,
  revokeSession,
} = injection(kBtnlauncher2Account)
const modrinth = injection(kModrinthAuthenticatedAPI)
const { show: showUserProfileDialog } = useUserMenuControl()

const accountStatusColor = computed(() => {
  const colors: Record<Btnlauncher2AccountStatus, string> = {
    active: 'success',
    merged: 'info',
    deletion_pending: 'warning',
    deleted: 'error',
  }
  return account.value ? colors[account.value.status] : undefined
})

function providerName(provider: Btnlauncher2OAuthProvider) {
  return provider[0].toUpperCase() + provider.slice(1)
}

function providerIcon(provider: Btnlauncher2OAuthProvider) {
  if (provider === 'microsoft' || provider === 'modrinth') return `btnlauncher2:${provider}`
  return provider === 'google' ? 'language' : 'forum'
}

function isProviderLinked(provider: Btnlauncher2OAuthProvider) {
  return identities.value.some((identity) => identity.provider === provider)
}

function formatDate(value: string) {
  const date = new Date(value)
  return Number.isNaN(date.valueOf())
    ? '—'
    : new Intl.DateTimeFormat(locale.value, {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(date)
}

function openMicrosoftLogin() {
  showUserProfileDialog('login')
}

function openModrinthLogin() {
  modrinth.interact()
}
</script>

<style scoped>
.btnlauncher2-account-panel {
  padding: 16px;
}

.btnlauncher2-account-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

@media (max-width: 900px) {
  .btnlauncher2-account-grid {
    grid-template-columns: 1fr;
  }
}
</style>

//
//  FeedbackGallery.swift
//  ComponentGallery
//
//  Created on 30-12-2025.
//

import SwiftUI
import ChatUIFoundation
import ChatUIComponents
import ChatUIThemes

/// Gallery of feedback components.
struct FeedbackGallery: View {
    @State private var showToast = false
    @State private var showModal = false

    var body: some View {
        VStack(alignment: .leading, spacing: FSpacing.s24) {
            GallerySection(title: "AlertView", subtitle: "Inline alerts with title + description") {
                VStack(alignment: .leading, spacing: FSpacing.s12) {
                    AlertView {
                        AlertTitle("Heads up")
                        AlertDescription("This is a standard alert message.")
                    }

                    AlertView(variant: .destructive, icon: Image(systemName: "exclamationmark.triangle.fill")) {
                        AlertTitle("Something went wrong")
                        AlertDescription("Please check your connection and try again.")
                    }
                }
            }

            GallerySection(title: "SkeletonView", subtitle: "Loading placeholders with reduced motion support") {
                VStack(alignment: .leading, spacing: FSpacing.s12) {
                    SkeletonView()
                        .frame(width: 180, height: 12)
                    SkeletonView()
                        .frame(width: 240, height: 12)
                    HStack(spacing: FSpacing.s12) {
                        SkeletonView(cornerRadius: 18)
                            .frame(width: 36, height: 36)
                        VStack(alignment: .leading, spacing: FSpacing.s8) {
                            SkeletonView()
                                .frame(width: 140, height: 10)
                            SkeletonView()
                                .frame(width: 200, height: 10)
                        }
                    }
                }
            }

            GallerySection(title: "ToastView", subtitle: "Transient notifications with actions") {
                VStack(alignment: .leading, spacing: FSpacing.s12) {
                    ChatUIButton("Show Toast", variant: .secondary, size: .sm) {
                        showToast = true
                    }

                    ZStack {
                        RoundedRectangle(cornerRadius: ChatGPTTheme.cardCornerRadius, style: .continuous)
                            .fill(FColor.bgCard)
                            .overlay(
                                RoundedRectangle(cornerRadius: ChatGPTTheme.cardCornerRadius, style: .continuous)
                                    .stroke(FColor.divider.opacity(0.2), lineWidth: 1)
                            )

                        ToastContainerView(position: .bottomTrailing) {
                            ToastView(
                                isPresented: $showToast,
                                variant: .success,
                                title: "Saved",
                                description: "Your changes were saved.",
                                icon: Image(systemName: "checkmark.circle.fill")
                            )
                        }
                    }
                    .frame(height: 140)
                }
            }

            GallerySection(title: "ModalDialogView", subtitle: "Blocking dialogs with header/body/footer") {
                VStack(alignment: .leading, spacing: FSpacing.s12) {
                    ChatUIButton("Show Modal", variant: .default, size: .sm) {
                        showModal = true
                    }

                    Text("Modal previews open over the gallery")
                        .font(FType.caption())
                        .foregroundStyle(FColor.textTertiary)
                }
            }
        }
        .overlay(
            ModalDialogView(isPresented: $showModal, title: "Confirm action", description: "This action cannot be undone.") {
                ModalBodyView {
                    Text("Are you sure you want to continue?")
                        .font(FType.rowTitle())
                        .foregroundStyle(FColor.textPrimary)
                }

                ModalFooterView {
                    ChatUIButton("Cancel", variant: .secondary) {
                        showModal = false
                    }
                    ChatUIButton("Confirm", variant: .default) {
                        showModal = false
                    }
                }
            }
        )
    }
}

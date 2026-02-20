import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    Alert,
    TouchableOpacity,
    Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { CustomButton, CustomTextInput } from '../components';
import { colors, commonStyles, spacing, typography } from '../styles';
import { Labels, Label } from '../types';
import { loadLabels, saveLabels } from '../utils/storage';

export default function LabelsScreen() {
    const [labels, setLabels] = useState<Labels>({});
    const [modalVisible, setModalVisible] = useState(false);
    const [modalType, setModalType] = useState<
        'newLabel' | 'newValue' | 'editValue'
    >('newLabel');
    const [selectedLabel, setSelectedLabel] = useState<string>('');
    const [selectedValueIndex, setSelectedValueIndex] = useState<number>(-1);
    const [inputValue, setInputValue] = useState('');

    useFocusEffect(
        useCallback(() => {
            loadLabelsData();
        }, []),
    );

    const loadLabelsData = async () => {
        try {
            const loadedLabels = await loadLabels();
            setLabels(loadedLabels);
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to load labels',
            });
        }
    };

    const saveLabelsData = async (newLabels: Labels) => {
        try {
            await saveLabels(newLabels);
            setLabels(newLabels);
            Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Labels saved successfully',
            });
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to save labels',
            });
        }
    };

    const openModal = (
        type: 'newLabel' | 'newValue' | 'editValue',
        labelName?: string,
        valueIndex?: number,
    ) => {
        setModalType(type);
        setSelectedLabel(labelName || '');
        setSelectedValueIndex(valueIndex ?? -1);
        setInputValue('');
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setInputValue('');
        setSelectedLabel('');
        setSelectedValueIndex(-1);
    };

    const handleModalSubmit = () => {
        if (!inputValue.trim()) {
            Alert.alert('Error', 'Please enter a value');
            return;
        }

        const newLabels = { ...labels };

        switch (modalType) {
            case 'newLabel':
                if (labels[inputValue.toLowerCase()]) {
                    Alert.alert('Error', 'Label already exists');
                    return;
                }
                newLabels[inputValue.toLowerCase()] = {
                    name: inputValue,
                    values: [{ value: 'Default', isDefault: true }],
                };
                break;

            case 'newValue':
                if (newLabels[selectedLabel]) {
                    const existingValues = newLabels[selectedLabel].values.map(
                        (v) => v.value,
                    );
                    if (existingValues.includes(inputValue)) {
                        Alert.alert('Error', 'Value already exists');
                        return;
                    }
                    newLabels[selectedLabel].values.push({
                        value: inputValue,
                        isDefault: false,
                    });
                }
                break;

            case 'editValue':
                if (newLabels[selectedLabel] && selectedValueIndex >= 0) {
                    newLabels[selectedLabel].values[selectedValueIndex].value =
                        inputValue;
                }
                break;
        }

        saveLabelsData(newLabels);
        closeModal();
    };

    const removeLabel = (labelName: string) => {
        if (labels[labelName]?.isFixed) {
            Alert.alert('Error', 'Cannot remove fixed labels');
            return;
        }

        Alert.alert(
            'Confirm Removal',
            `Are you sure you want to remove the "${labels[labelName]?.name}" label?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Remove',
                    style: 'destructive',
                    onPress: () => {
                        const newLabels = { ...labels };
                        delete newLabels[labelName];
                        saveLabelsData(newLabels);
                    },
                },
            ],
        );
    };

    const removeValue = (labelName: string, valueIndex: number) => {
        const label = labels[labelName];
        if (label.values.length <= 1) {
            Alert.alert('Error', 'Cannot remove the last value');
            return;
        }

        if (label.values[valueIndex].isDefault) {
            Alert.alert(
                'Error',
                'Cannot remove the default value. Set another value as default first.',
            );
            return;
        }

        Alert.alert(
            'Confirm Removal',
            `Remove "${label.values[valueIndex].value}"?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Remove',
                    style: 'destructive',
                    onPress: () => {
                        const newLabels = { ...labels };
                        newLabels[labelName].values.splice(valueIndex, 1);
                        saveLabelsData(newLabels);
                    },
                },
            ],
        );
    };

    const setDefaultValue = (labelName: string, valueIndex: number) => {
        const newLabels = { ...labels };
        newLabels[labelName].values.forEach((value, index) => {
            value.isDefault = index === valueIndex;
        });
        saveLabelsData(newLabels);
    };

    const renderLabel = (labelName: string, label: Label) => (
        <View key={labelName} style={styles.labelCard}>
            <View style={styles.labelHeader}>
                <Text style={styles.labelTitle}>{label.name}</Text>
                {!label.isFixed && (
                    <TouchableOpacity onPress={() => removeLabel(labelName)}>
                        <Ionicons name="trash" size={20} color={colors.error} />
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.valuesContainer}>
                {label.values.map((value, index) => (
                    <View key={`${labelName}-${index}`} style={styles.valueRow}>
                        <View style={styles.valueContent}>
                            <Text
                                style={[
                                    styles.valueText,
                                    value.isDefault && styles.defaultValueText,
                                ]}
                            >
                                {value.value}
                            </Text>
                            {value.isDefault && (
                                <Text style={styles.defaultBadge}>DEFAULT</Text>
                            )}
                        </View>
                        <View style={styles.valueActions}>
                            {!value.isDefault && (
                                <TouchableOpacity
                                    onPress={() =>
                                        setDefaultValue(labelName, index)
                                    }
                                    style={styles.actionButton}
                                >
                                    <Text style={styles.actionButtonText}>
                                        Set Default
                                    </Text>
                                </TouchableOpacity>
                            )}
                            <TouchableOpacity
                                onPress={() => removeValue(labelName, index)}
                                style={styles.actionButton}
                            >
                                <Ionicons
                                    name="trash"
                                    size={16}
                                    color={colors.error}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
            </View>

            <CustomButton
                title="Add Value"
                onPress={() => openModal('newValue', labelName)}
                size="small"
                variant="secondary"
            />
        </View>
    );

    return (
        <View style={commonStyles.container}>
            <Text style={[typography.h1, styles.title]}>Label Settings</Text>

            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
            >
                {Object.entries(labels).map(([labelName, label]) =>
                    renderLabel(labelName, label),
                )}

                <CustomButton
                    title="Add New Label"
                    onPress={() => openModal('newLabel')}
                    variant="secondary"
                />
            </ScrollView>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={closeModal}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>
                            {modalType === 'newLabel' && 'Add New Label'}
                            {modalType === 'newValue' &&
                                `Add Value to ${labels[selectedLabel]?.name}`}
                            {modalType === 'editValue' && 'Edit Value'}
                        </Text>

                        <CustomTextInput
                            placeholder="Enter value"
                            value={inputValue}
                            onChangeText={setInputValue}
                            autoFocus
                        />

                        <View style={styles.modalActions}>
                            <CustomButton
                                title="Cancel"
                                onPress={closeModal}
                                variant="secondary"
                                size="small"
                            />
                            <CustomButton
                                title="Add"
                                onPress={handleModalSubmit}
                                size="small"
                            />
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    title: {
        textAlign: 'center',
        marginBottom: spacing.lg,
    },
    scrollView: {
        flex: 1,
    },
    labelCard: {
        ...commonStyles.card,
        marginBottom: spacing.md,
    },
    labelHeader: {
        ...commonStyles.row,
        marginBottom: spacing.md,
    },
    labelTitle: {
        ...typography.h3,
        flex: 1,
    },
    valuesContainer: {
        marginBottom: spacing.md,
    },
    valueRow: {
        ...commonStyles.row,
        paddingVertical: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    valueContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    valueText: {
        ...typography.body,
        marginRight: spacing.sm,
    },
    defaultValueText: {
        fontWeight: '600',
        color: colors.accent,
    },
    defaultBadge: {
        fontSize: 10,
        color: colors.accent,
        backgroundColor: colors.surface,
        paddingHorizontal: spacing.xs,
        paddingVertical: 2,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: colors.accent,
    },
    valueActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    actionButton: {
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
    },
    actionButtonText: {
        ...typography.caption,
        color: colors.accent,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: colors.surface,
        padding: spacing.lg,
        borderRadius: 12,
        width: '80%',
        maxWidth: 400,
    },
    modalTitle: {
        ...typography.h3,
        textAlign: 'center',
        marginBottom: spacing.lg,
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: spacing.lg,
        gap: spacing.md,
    },
});
